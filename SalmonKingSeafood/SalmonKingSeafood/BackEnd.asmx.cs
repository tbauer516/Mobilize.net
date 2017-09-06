using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SalmonKingSeafood.BackEndUtils;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

namespace SalmonKingSeafood
{
    /// <summary>
    /// Summary description for WebService1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class BackEnd : System.Web.Services.WebService
    {

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }


        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string SQLTest()
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                // var results = new Dictionary<string, object>();
                var results = new List<Dictionary<string, object>>();
                
                string cmdString = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = @tableType";

                SqlCommand testCmd = new SqlCommand(cmdString, dbconnect);
                testCmd.Parameters.AddWithValue("@tableType", "BASE TABLE");
                dbconnect.Open();
                
                using (SqlDataReader reader = testCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                //Context.Response.Write(new JavaScriptSerializer().Serialize(results));
                return new JavaScriptSerializer().Serialize(results);
            }
        }
        
        
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string ViewSupplier()
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                var results = new List<Dictionary<string, object>>();
                string cmdString = "SELECT * FROM viewSupplierInfo"; 
                SqlCommand SupplierCMD = new SqlCommand(cmdString, dbconnect);
                dbconnect.Open();

                using (SqlDataReader reader = SupplierCMD.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }
                dbconnect.Close();
                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                return new JavaScriptSerializer().Serialize(results);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public string InsertSupplier(String[] supplierForm)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                String[] supplierInfo = { "SupplierName", "PaymentTerms", "Notes", "Fname", "Lname", "Email", "Phone", "Title", "Extension", "Fax", "BillingAddress", "City", "State", "Zipcode", "Country" };
                var results = new List<Dictionary<string, object>>();

                var cmdString = "exec uspInsertSupplier @" + supplierInfo[0] + " = '" + supplierForm[0] + "'";
                for (int i = 1; i < supplierForm.Length; i++)
                {
                    cmdString += " , @" + supplierInfo[i] + " = '" + supplierForm[i] + "'";
                }

                SqlCommand insertProductCmd = new SqlCommand(cmdString, dbconnect);
                for (int i = 0; i < supplierForm.Length; i++)
                {
                    insertProductCmd.Parameters.AddWithValue(supplierInfo[i], supplierForm[i]);
                }
                dbconnect.Open();

                using (SqlDataReader reader = insertProductCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();
                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                return new JavaScriptSerializer().Serialize(results);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public string UpdateSupplier(String[] supplierForm)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                String[] supplierInfo = { "SupplierName", "PaymentTerms", "Notes", "Fname", "Lname", "Email", "Phone", "Title", "Extension", "Fax", "BillingAddress", "City", "State", "Zipcode", "Country" };
                var results = new List<Dictionary<string, object>>();

                var cmdString = "exec uspUpdateSupplier @" + supplierInfo[0] + " = '" + supplierForm[0] + "'";
                for (int i = 1; i < supplierForm.Length; i++)
                {
                    cmdString += " , @" + supplierInfo[i] + " = '" + supplierForm[i] + "'";
                }

                SqlCommand insertProductCmd = new SqlCommand(cmdString, dbconnect);
                for (int i = 0; i < supplierForm.Length; i++)
                {
                    insertProductCmd.Parameters.AddWithValue(supplierInfo[i], supplierForm[i]);
                }
                dbconnect.Open();

                using (SqlDataReader reader = insertProductCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();
                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                return new JavaScriptSerializer().Serialize(results);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public string DeleteSupplier(String[] supplierForm)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                String[] supplierInfo = { "SupplierName", "Fname", "Lname", "Title", "BillingAddress", "City", "State", "Zipcode", "Country" };
                var results = new List<Dictionary<string, object>>();

                var cmdString = "exec uspDeleteSupplier @" + supplierInfo[0] + " = '" + supplierForm[0] + "'";
                for (int i = 1; i < supplierForm.Length; i++)
                {
                    cmdString += " , @" + supplierInfo[i] + " = '" + supplierForm[i] + "'";
                }

                SqlCommand insertProductCmd = new SqlCommand(cmdString, dbconnect);
                for (int i = 0; i < supplierForm.Length; i++)
                {
                    insertProductCmd.Parameters.AddWithValue(supplierInfo[i], supplierForm[i]);
                }
                dbconnect.Open();

                using (SqlDataReader reader = insertProductCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();
                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                return new JavaScriptSerializer().Serialize(results);
            }
        }
        

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string SQLInsertNewProduct(String[] productInfo)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                // var results = new Dictionary<string, object>();
                var results = new List<Dictionary<string, object>>();
                
                string cmdString = "INSERT INTO tblPRODUCT(ProductName, ProductCode, ProductDescr, ProductCategory, ProductSerialNumber, Discontinued, UnitPrice, QtyPerUnit) " +
                                   "VALUES (@ProductName, @ProductCode, @ProductDescr, @ProductCategory, @ProductSerialNumber, @Discontinued, @UnitPrice, @QtyPerUnit)";

                SqlCommand insertProductCmd = new SqlCommand(cmdString, dbconnect);
                insertProductCmd.Parameters.AddWithValue("@ProductName", productInfo[0]);
                insertProductCmd.Parameters.AddWithValue("@ProductCode", productInfo[1]);
                insertProductCmd.Parameters.AddWithValue("@ProductDescr", productInfo[2]);
                insertProductCmd.Parameters.AddWithValue("@ProductCategory", productInfo[3]);
                insertProductCmd.Parameters.AddWithValue("@ProductSerialNumber", productInfo[4]);
                insertProductCmd.Parameters.AddWithValue("@Discontinued", productInfo[5]);
                insertProductCmd.Parameters.AddWithValue("@UnitPrice", productInfo[6]);
                insertProductCmd.Parameters.AddWithValue("@QtyPerUnit", productInfo[7]);
                dbconnect.Open();

                using (SqlDataReader reader = insertProductCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                //Context.Response.Write(new JavaScriptSerializer().Serialize(results));
                return new JavaScriptSerializer().Serialize(results);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string SQLFindProduct(string ProductName, string ProductCode, string SerialNumber, string Discontinued, string UnitPrice, string QuantityPerUnit, string Unit)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                // var results = new Dictionary<string, object>();
                var results = new List<Dictionary<string, object>>();

                string cmdString = "SELECT * FROM tblPRODUCT WHERE " +
                                   "(ProductName = @ProductName OR ProductName LIKE '%')" +
                                   "AND (ProductCode = @ProductCode OR ProductCode LIKE '%')" +
                                   "AND (SerialNumber = @SerialNumber OR SerialNumber LIKE '%')" +
                                   "AND (Discontinued = @Discontinued OR Discontinued LIKE '%')" +
                                   "AND (UnitPrice = @UnitPrice OR UnitPrice LIKE '%')" +
                                   "AND (QuantityPerUnit = @QuantityPerUnit OR QuantityPerUnit LIKE '%')" +
                                   "AND (Unit = @Unit OR Unit LIKE '%')";
                SqlCommand FindProductCmd = new SqlCommand(cmdString, dbconnect);
                FindProductCmd.Parameters.AddWithValue("@ProductName", ProductName);
                FindProductCmd.Parameters.AddWithValue("@ProductCode", ProductCode);
                FindProductCmd.Parameters.AddWithValue("@SerialNumber", SerialNumber);
                FindProductCmd.Parameters.AddWithValue("@Discontinued", Discontinued);
                FindProductCmd.Parameters.AddWithValue("@UnitPrice", UnitPrice);
                FindProductCmd.Parameters.AddWithValue("@QtyPerUnit", QuantityPerUnit);
                FindProductCmd.Parameters.AddWithValue("@Unit", Unit);
                dbconnect.Open();

                using (SqlDataReader reader = FindProductCmd.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var item = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                item.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            results.Add(item);
                        }
                    }
                }

                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                //Context.Response.Write(new JavaScriptSerializer().Serialize(results));
                return new JavaScriptSerializer().Serialize(results);
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetCustomers()
        {
            return Order.GetCustomers(Context);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetProducts(object CustomerID)
        {
            return Order.GetProducts(Context, CustomerID);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetTax()
        {
            return Order.GetTax(Context);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CreateOrder(int customerID, List<object> products)
        {
            return Order.CreateOrder(Context, customerID, products);
        }

    }

}
