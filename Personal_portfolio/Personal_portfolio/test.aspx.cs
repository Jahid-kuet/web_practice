using System;

namespace PortfolioWebsite
{
    public partial class test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lblMsg.Text = "Test page loaded at " + DateTime.Now.ToString();
        }
    }
}
