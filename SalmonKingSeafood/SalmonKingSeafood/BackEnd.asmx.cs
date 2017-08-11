using System;
using System.Collections.Generic;
using System.Configuration;
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
    }
}
