﻿using System;
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

                SqlCommand GetCustomersCmd = new SqlCommand(cmdString, dbconnect);
                //testCmd.Parameters.AddWithValue("@tableType", "BASE TABLE");
                dbconnect.Open();

                using (SqlDataReader reader = GetCustomersCmd.ExecuteReader())
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

        public static string GetProducts(HttpContext Context, int CustomerID)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                // var results = new Dictionary<string, object>();
                var results = new List<Dictionary<string, object>>();

                string cmdString = "" +
                    "SELECT prod.ProductCode Code, prod.ProductName Product, prod.UnitPrice, prod.QuantityPerUnit QuantityPer, prod.ProductID " +
                    "FROM tblPRODUCT prod";

                SqlCommand GetProductsCmd = new SqlCommand(cmdString, dbconnect);
                //GetProductsCmd.Parameters.AddWithValue("@CustomerID", CustomerID);
                dbconnect.Open();

                using (SqlDataReader reader = GetProductsCmd.ExecuteReader())
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

        public static string PlaceOrder(HttpContext Context, List<Dictionary<string, object>> LineItems)
        {
            using (System.Data.SqlClient.SqlConnection dbconnect = new SqlConnection(ConfigurationManager.ConnectionStrings["SKSData"].ToString()))
            {
                string cmdString = "EXEC uspAddLineItem(@prodID, @custID, @quantity, @datetime)";
                string CurrentDateTime = DateTime.Now.ToString();

                dbconnect.Open();

                foreach (Dictionary<string, object> product in LineItems)
                {
                    SqlCommand AddProductCmd = new SqlCommand(cmdString, dbconnect);
                    AddProductCmd.Parameters.AddWithValue("@prodID", product["ProductID"]);
                    AddProductCmd.Parameters.AddWithValue("@custID", product["CustomerID"]);
                    AddProductCmd.Parameters.AddWithValue("@quantity", product["Quantity"]);
                    AddProductCmd.Parameters.AddWithValue("@datetime", CurrentDateTime);

                    try
                    {
                        AddProductCmd.ExecuteNonQuery();
                    }
                    catch (Exception e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                }
                
                dbconnect.Close();

                Context.Response.Clear();
                Context.Response.ContentType = "application/json";
                //Context.Response.Write(new JavaScriptSerializer().Serialize(results));
                //System.Diagnostics.Debug.WriteLine(results);
                //return new JavaScriptSerializer().Serialize(results);
                return "Completed";
            }
        }
    }
}