using SalmonKingSeafood.BackEndUtils;
using SalmonKingSeafood.suppliers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
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
            Supplier supplier = new Supplier();
            return supplier.getSupplierView(Context, "");
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public string SupplierMethod(String[] supplierForm)
        {
            Supplier supplier = new Supplier();
            return supplier.getSupplierMethod(Context, supplierForm);
        }


        [WebMethod]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public string ProductSQL(String[] data, String[] info)
        {
            return Product.ProductSQL(Context, data, info);
        }


        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string SQLViewProduct()
        {
            return Product.SQLViewProduct(Context);
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

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ViewOrders()
        {
            return Order.ViewOrders(Context);
        }

    }

}
