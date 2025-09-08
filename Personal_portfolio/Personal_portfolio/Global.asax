<%@ Application Language="C#" %>
<script runat="server">
    void Application_BeginRequest(object sender, System.EventArgs e)
    {
        try
        {
            var path = Server.MapPath("~/App_Data/error_log.txt");
        System.IO.File.AppendAllText(path, System.DateTime.Now + ": BeginRequest " + Request.RawUrl + "\r\n");
        }
        catch { }
    }

    void Application_Error(object sender, System.EventArgs e)
    {
        var ex = Server.GetLastError();
        try
        {
            // Write to debug and file log
            System.Diagnostics.Debug.WriteLine("[Application_Error] " + ex);
            var path = Server.MapPath("~/App_Data/error_log.txt");
        System.IO.File.AppendAllText(path, System.DateTime.Now + ": " + ex + "\r\n\r\n");
        }
        catch { }

        // Show details locally for debugging
        try
        {
            Response.Clear();
            Response.ContentType = "text/plain";
            Response.Write("Unhandled exception in application:\r\n\r\n" + ex);
        }
        catch { }
        finally
        {
            Server.ClearError();
        }
    }
</script>
