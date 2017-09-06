using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;

namespace SalmonKingSeafood.BackEndUtils
{
    public class Order
    {
        public static List<Dictionary<string, object>> MakeSQLQuery(string QueryString)
        {
            return MakeSQLQuery(QueryString, new Dictionary<string, object>());
        }

        public static List<Dictionary<string, object>> MakeSQLQuery(string QueryString, Dictionary<string, object> Parameters)
        {
            var results = new List<Dictionary<string, object>>();
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                SqlCommand SqlCmd = new SqlCommand(QueryString, dbconnect);

                if (Parameters == null)
                {
                    Parameters = new Dictionary<string, object>();
                }

                foreach (string key in Parameters.Keys)
                {
                    SqlCmd.Parameters.AddWithValue(key, Parameters[key]);
                }
                dbconnect.Open();

                using (SqlDataReader reader = SqlCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                if (!item.ContainsKey(reader.GetName(i)))
                                    item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();

                return results;
            }
        }

        public static string GetCustomers(HttpContext Context)
        {
            string cmdString = "" +
                "SELECT cust.CustomerID, cust.CompanyName, cont.FName ContactFirstName, " +
                "cont.LName ContactLastName, loc.City, loc.State, loc.Country " +
                "FROM tblCUSTOMER cust " +
                "JOIN tblCONTACT cont ON cont.ContactID = cust.ContactID " +
                "JOIN tblLOCATION loc ON loc.LocationID = cont.LocationID";

            var results = MakeSQLQuery(cmdString);

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            return new JavaScriptSerializer().Serialize(results);
        }

        public static string GetProducts(HttpContext Context, object CustomerID)
        {
            string cmdString = "" +
                "SELECT prod.ProductCode Code, prod.ProductName Product, prod.UnitPrice, prod.QuantityPerUnit QuantityPer, prod.ProductID, prod.Unit Existence " +
                "FROM tblPRODUCT prod";

            var products = MakeSQLQuery(cmdString);
            var ordered = new List<Dictionary<string, object>>();

            if (CustomerID != null)
                ordered = GetOrdered((int) CustomerID);

            foreach (Dictionary<string, object> item in products)
            {
                item["Ordered"] = 0;
                foreach (Dictionary<string, object> order in ordered)
                {
                    if ((int) item["ProductID"] == (int) order["ProductID"])
                        item["Ordered"] = order["TotalOrdered"];
                }
            }

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            return new JavaScriptSerializer().Serialize(products);
        }

        public static string GetTax(HttpContext Context)
        {
            string cmdString = "" +
                "SELECT TOP 1 TaxPercent " +
                "FROM tblTAX " +
                "ORDER BY TaxID DESC";

            var results = MakeSQLQuery(cmdString);

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            return new JavaScriptSerializer().Serialize(results);
        }

        public static List<Dictionary<string, object>> GetOrdered(int CustomerID)
        {
            string cmdString = "" +
                "SELECT li.ProductID, SUM(li.Quantity) 'TotalOrdered' " +
                "FROM tblORDER ord JOIN tblLINE_ITEM li ON li.OrderID = ord.OrderID " +
                "WHERE ord.CustomerID = @CustomerID " +
                "GROUP BY li.ProductID";

            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("@CustomerID", CustomerID);

            var results = MakeSQLQuery(cmdString, parameters);
            return results;
        }
        
        public static string CreateOrder(HttpContext Context, int CustomerID, List<object> LineItems)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                string cmdString = "uspAddLineItem";
                string CurrentDateTime = DateTime.Now.ToString();

                Dictionary<string, string> returnStatus = new Dictionary<string, string>();
                returnStatus.Add("ReturnValue", "Completed");

                dbconnect.Open();

                using (SqlTransaction dbTrans = dbconnect.BeginTransaction())
                {
                    try
                    {
                        foreach (Dictionary<string, object> product in LineItems)
                        {
                            using (SqlCommand AddProductCmd = new SqlCommand(cmdString, dbconnect))
                            {
                                AddProductCmd.CommandType = System.Data.CommandType.StoredProcedure;
                                AddProductCmd.Transaction = dbTrans;

                                AddProductCmd.Parameters.AddWithValue("@ProductID", (int)product["id"]);
                                AddProductCmd.Parameters.AddWithValue("@CustomerID", CustomerID);
                                AddProductCmd.Parameters.AddWithValue("@QuantityOrdered", (int)product["quantity"]);
                                AddProductCmd.Parameters.AddWithValue("@OrderDate", CurrentDateTime);

                                AddProductCmd.ExecuteNonQuery();
                            }
                        }

                        dbTrans.Commit();
                    }
                    catch (SqlException)
                    {
                        dbTrans.Rollback();
                        returnStatus["ReturnValue"] = "Failed";
                        throw; // bubble up the exception and preserve the stack trace
                    }
                }

                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                return new JavaScriptSerializer().Serialize(returnStatus);
            }
        }

        public static string ViewOrders(HttpContext Context)
        {
            string cmdString = "SELECT cust.CompanyName, ord.OrderDate, ord.TotalAmount, li.OrderID, li.Quantity, prod.ProductName, prod.UnitPrice " +
                "FROM tblLINE_ITEM li " +
                "JOIN tblORDER ord ON li.OrderID = ord.OrderID " +
                "JOIN tblPRODUCT prod ON prod.ProductID = li.ProductID " +
                "JOIN tblCUSTOMER cust ON ord.CustomerID = cust.CustomerID " +
                "ORDER BY li.OrderID DESC";

            var results = MakeSQLQuery(cmdString);

            Context.Response.Clear();
            Context.Response.ContentType = "application/json";
            return new JavaScriptSerializer().Serialize(results);
        }
    }
}