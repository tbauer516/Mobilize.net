using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Script.Serialization;

namespace SalmonKingSeafood.suppliers
{
    public class Supplier
    {
        public string getSupplierMethod(HttpContext Context, String[] supplierForm)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                String[] supplierInfo = { "SupplierName", "PaymentTerms", "Notes", "Fname", "Lname", "Email", "Phone", "Title", "Extension", "Fax", "BillingAddress", "City", "State", "Zipcode", "Country" };
                String[] deleteInfo = { "SupplierName", "Fname", "Lname", "Title", "BillingAddress", "City", "State", "Zipcode", "Country" };
                if (supplierForm[0] == "Delete")
                {
                    supplierInfo = deleteInfo;
                }

                var cmdString = "exec usp" + supplierForm[0] + "Supplier @" + supplierInfo[0] + " = '" + supplierForm[1] + "'";
                var results = new List<Dictionary<string, object>>();

                for (int i = 1; i < supplierInfo.Length; i++)
                {
                    cmdString += " , @" + supplierInfo[i] + " = '" + supplierForm[i + 1] + "'";
                }

                SqlCommand insertProductCmd = new SqlCommand(cmdString, dbconnect);
                for (int i = 0; i < supplierInfo.Length; i++)
                {
                    insertProductCmd.Parameters.AddWithValue(supplierInfo[i], supplierForm[i + 1]);
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

        public string getSupplierView(HttpContext Context)
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
    }
}