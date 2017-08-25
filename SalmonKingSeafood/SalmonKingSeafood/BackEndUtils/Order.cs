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
        public static string GetCustomers(HttpContext Context)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                // var results = new Dictionary<string, object>();
                var results = new List<Dictionary<string, object>>();

                string cmdString = "" +
                    "SELECT cust.CustomerID, cust.CompanyName, cont.FName ContactFirstName, " +
                    "cont.LName ContactLastName, loc.City, loc.State, loc.Country " +
                    "FROM tblCUSTOMER cust " +
                    "JOIN tblCONTACT cont ON cont.ContactID = cust.ContactID " +
                    "JOIN tblLOCATION loc ON loc.LocationID = cont.LocationID";

                SqlCommand testCmd = new SqlCommand(cmdString, dbconnect);
                //testCmd.Parameters.AddWithValue("@tableType", "BASE TABLE");
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
                                if (!item.ContainsKey(reader.GetName(i)))
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

        public static void PlaceOrder(HttpContext Context, Dictionary<string, object> Ids)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                var results = new List<Dictionary<string, object>>();

                string cmdString = "EXEC ";

                SqlCommand testCmd = new SqlCommand(cmdString, dbconnect);
                //testCmd.Parameters.AddWithValue("@tableType", "BASE TABLE");
                dbconnect.Open();

                using (SqlDataReader reader = testCmd.ExecuteReader())
                {
                    
                }

                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                //Context.Response.Write(new JavaScriptSerializer().Serialize(results));
                System.Diagnostics.Debug.WriteLine(results);
                return new JavaScriptSerializer().Serialize(results);
            }
        }
    }
}