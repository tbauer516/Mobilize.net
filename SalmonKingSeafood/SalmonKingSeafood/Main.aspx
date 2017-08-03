<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Main.aspx.cs" Inherits="SalmonKingSeafood.Main" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
<form id="form1" runat="server">
        <div>
            <asp:Menu ID="menuBar"
                staticdisplaylevels="2"
                staticsubmenuindent="10px" 
                staticenabledefaultpopoutimage="false"
                orientation="Horizontal"
                dynamichorizontaloffset="10"
                target="_blank"  
                runat="server" OnMenuItemClick="menuBar_MenuItemClick">
                <Items>
                    <asp:MenuItem Text="">
                        <asp:MenuItem Text="Files">
                            <asp:MenuItem navigateurl="" Text="Manage Customers"/>
                            <asp:MenuItem navigateurl="" Text="Manage Suppliers"/>
                            <asp:MenuItem navigateurl="" Text="Exit"/>
                        </asp:MenuItem>
                        <asp:MenuItem Text="Orders">
                            <asp:MenuItem navigateurl="" Text="Create Order"></asp:MenuItem>
                            <asp:MenuItem navigateurl="" Text="Create Invoice"></asp:MenuItem>
                            <asp:MenuItem Text="________________"></asp:MenuItem>
                            <asp:MenuItem navigateurl="" Text="Add Stock Order"></asp:MenuItem>
                            <asp:MenuItem navigateurl="" Text="Add Stock to Inventory"></asp:MenuItem>
                        </asp:MenuItem>
                        <asp:MenuItem Text="Inventory">
                            <asp:MenuItem navigateurl="" Text="Inventory Update"></asp:MenuItem>
                            <asp:MenuItem navigateurl="" Text="Inventory Adjust"></asp:MenuItem>
                        </asp:MenuItem>
                        <asp:MenuItem Text="Maintenance">
                            <asp:MenuItem navigateurl="" Text="Manage Products"></asp:MenuItem>
                            <asp:MenuItem navigateurl="" Text="Manage Users"></asp:MenuItem>
                        </asp:MenuItem>
                        <asp:MenuItem Text="Help">
                            <asp:MenuItem Value="About" Text="About"></asp:MenuItem>
                        </asp:MenuItem>
                    </asp:MenuItem>
                </Items>
            </asp:Menu>
        </div>
    </form>
</body>
</html>
