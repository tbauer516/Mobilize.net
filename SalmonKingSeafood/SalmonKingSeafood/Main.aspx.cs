using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SalmonKingSeafood
{
    public partial class Main : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void menuBar_MenuItemClick(object sender, MenuEventArgs e)
        {
            var value = e.Item.Value;
            if (value == "Exit")
            {
                System.Environment.Exit(1);
            }
            // Redirect to respective page
            // ie -> click About goes to About.aspx
            Response.Redirect(e.Item.Value + ".aspx");
        }
    }
}z