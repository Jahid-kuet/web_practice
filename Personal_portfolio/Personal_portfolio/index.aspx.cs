using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.IO;
using System.Net;
using System.Net.Mail;

namespace PortfolioWebsite
{
    public partial class index : System.Web.UI.Page
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadPortfolioData();
                RegisterClientScripts();
            }
        }

        #region Data Loading Methods

        private void LoadPortfolioData()
        {
            try
            {
                LoadTechnicalSkills();
                LoadProjects();
                LoadCertifications();
                LoadPersonalInfo();
            }
            catch (Exception ex)
            {
                LogError("LoadPortfolioData", ex);
                ShowErrorMessage("Error loading portfolio data. Please try again later.");
            }
        }

        private void LoadTechnicalSkills()
        {
            string query = @"
                SELECT 
                    SkillID, 
                    CategoryName, 
                    SkillName, 
                    SkillLevel, 
                    SkillDescription, 
                    IconImage, 
                    DisplayOrder,
                    IsActive,
                    CreatedDate,
                    UpdatedDate
                FROM TechnicalSkills 
                WHERE IsActive = 1 
                ORDER BY DisplayOrder, CategoryName, SkillName";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var skills = new List<object>();
                        
                        while (reader.Read())
                        {
                            skills.Add(new
                            {
                                SkillID = reader["SkillID"],
                                SkillName = reader["SkillName"].ToString(),
                                CategoryName = reader["CategoryName"].ToString(),
                                SkillLevel = reader["SkillLevel"].ToString(),
                                SkillDescription = reader["SkillDescription"].ToString(),
                                IconImage = reader["IconImage"].ToString(),
                                DisplayOrder = reader["DisplayOrder"],
                                CreatedDate = reader["CreatedDate"],
                                UpdatedDate = reader["UpdatedDate"]
                            });
                        }

                        // Store in ViewState for JavaScript access
                        ViewState["SkillsData"] = new JavaScriptSerializer().Serialize(skills);
                    }
                }
            }
        }


        private void LoadProjects()
        {
            string query = @"
        SELECT 
            ProjectID,
            ProjectTitle,
            ProjectDescription,
            ProjectImage,
            GitHubLink
        FROM Projects
        WHERE IsActive = 1
        ORDER BY IsFeatured DESC, DisplayOrder, CreatedDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var projects = new List<object>();

                        while (reader.Read())
                        {
                            projects.Add(new
                            {
                                ProjectID = reader["ProjectID"],
                                ProjectTitle = reader["ProjectTitle"].ToString(),
                                ProjectDescription = reader["ProjectDescription"].ToString(),
                                ProjectImage = reader["ProjectImage"].ToString(),
                                GitHubLink = reader["GitHubLink"].ToString()
                            });
                        }

                        // ✅ Bind to repeater
                        rptProjects.DataSource = projects;
                        rptProjects.DataBind();

                        // ✅ Store JSON for optional frontend JS
                        ViewState["ProjectsData"] = new JavaScriptSerializer().Serialize(projects);
                    }
                }
            }

            // ✅ Console log for debugging
            ClientScript.RegisterStartupScript(
                this.GetType(),
                "logProjects",
                "console.log('Projects loaded successfully. Count: " + rptProjects.Items.Count + "');",
                true
            );
        }



        private void LoadCertifications()
        {
            string query = @"
        SELECT 
            CertID,
            CertTitle,
            CertDescription,
            CertImage,
            IssueDate
        FROM CertificationsAchievements 
        WHERE IsActive = 1 
        ORDER BY IsFeatured DESC, DisplayOrder, IssueDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var certifications = new List<object>();

                        while (reader.Read())
                        {
                            certifications.Add(new
                            {
                                CertID = reader["CertID"],
                                CertTitle = reader["CertTitle"].ToString(),
                                CertDescription = reader["CertDescription"].ToString(),
                                CertImage = reader["CertImage"].ToString(),
                                IssueDate = reader["IssueDate"]
                            });
                        }

                        // ✅ Bind to repeater
                        rptCertifications.DataSource = certifications;
                        rptCertifications.DataBind();

                        // ✅ Store JSON for JS (optional)
                        ViewState["CertificationsData"] = new JavaScriptSerializer().Serialize(certifications);
                    }
                }
            }
        }

        private void LoadPersonalInfo()
        {
            string query = @"
                SELECT 
                    FullName,
                    Title,
                    AboutMe,
                    Email,
                    Phone,
                    Location,
                    LinkedInURL,
                    GitHubURL,
                    TwitterURL,
                    ProfileImagePath,
                    ResumeFilePath,
                    UpdatedDate
                FROM PersonalInfo 
                WHERE IsActive = 1";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Store personal info in ViewState
                            ViewState["PersonalInfo"] = new JavaScriptSerializer().Serialize(new
                            {
                                FullName = reader["FullName"].ToString(),
                                Title = reader["Title"].ToString(),
                                AboutMe = reader["AboutMe"].ToString(),
                                Email = reader["Email"].ToString(),
                                Phone = reader["Phone"].ToString(),
                                Location = reader["Location"].ToString(),
                                LinkedInURL = reader["LinkedInURL"].ToString(),
                                GitHubURL = reader["GitHubURL"].ToString(),
                                TwitterURL = reader["TwitterURL"].ToString(),
                                ProfileImagePath = reader["ProfileImagePath"].ToString(),
                                ResumeFilePath = reader["ResumeFilePath"].ToString(),
                                UpdatedDate = reader["UpdatedDate"]
                            });
                        }
                    }
                }
            }
        }

        #endregion

        #region Web Methods for AJAX Calls

        [WebMethod]
        public static string GetSkillsByCategory(string category)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
            
            string query = @"
                SELECT 
                    SkillID, 
                    SkillName, 
                    CategoryName, 
                    SkillLevel, 
                    SkillDescription, 
                    IconImage,
                    DisplayOrder
                FROM TechnicalSkills 
                WHERE IsActive = 1";

            if (!string.IsNullOrEmpty(category) && category != "all")
            {
                query += " AND CategoryName = @CategoryName";
            }

            query += " ORDER BY DisplayOrder, SkillLevel DESC, SkillName";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (!string.IsNullOrEmpty(category) && category != "all")
                    {
                        cmd.Parameters.AddWithValue("@CategoryName", category);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var skills = new List<object>();
                        
                        while (reader.Read())
                        {
                            skills.Add(new
                            {
                                SkillID = reader["SkillID"],
                                SkillName = reader["SkillName"].ToString(),
                                CategoryName = reader["CategoryName"].ToString(),
                                SkillLevel = reader["SkillLevel"].ToString(),
                                SkillDescription = reader["SkillDescription"].ToString(),
                                IconImage = reader["IconImage"].ToString(),
                                DisplayOrder = reader["DisplayOrder"]
                            });
                        }

                        return new JavaScriptSerializer().Serialize(new { success = true, data = skills });
                    }
                }
            }
        }

        [WebMethod]
        public static string GetProjectsByCategory(string category)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
            
            string query = @"
                SELECT 
                    ProjectID,
                    ProjectTitle,
                    ProjectDescription,
                    ProjectImage,
                    GitHubLink,
                    LiveDemoLink,
                    TechStack,
                    ProjectType,
                    StartDate,
                    EndDate,
                    IsCompleted,
                    IsFeatured,
                    DisplayOrder
                FROM Projects 
                WHERE IsActive = 1";

            if (!string.IsNullOrEmpty(category) && category != "all")
            {
                query += " AND ProjectType = @ProjectType";
            }

            query += " ORDER BY IsFeatured DESC, DisplayOrder, CreatedDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (!string.IsNullOrEmpty(category) && category != "all")
                    {
                        cmd.Parameters.AddWithValue("@ProjectType", category);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var projects = new List<object>();
                        
                        while (reader.Read())
                        {
                            projects.Add(new
                            {
                                ProjectID = reader["ProjectID"],
                                ProjectTitle = reader["ProjectTitle"].ToString(),
                                ProjectDescription = reader["ProjectDescription"].ToString(),
                                ProjectImage = reader["ProjectImage"].ToString(),
                                GitHubLink = reader["GitHubLink"].ToString(),
                                LiveDemoLink = reader["LiveDemoLink"].ToString(),
                                TechStack = reader["TechStack"].ToString(),
                                ProjectType = reader["ProjectType"].ToString(),
                                StartDate = reader["StartDate"],
                                EndDate = reader["EndDate"],
                                IsCompleted = reader["IsCompleted"],
                                IsFeatured = reader["IsFeatured"],
                                DisplayOrder = reader["DisplayOrder"]
                            });
                        }

                        return new JavaScriptSerializer().Serialize(new { success = true, data = projects });
                    }
                }
            }
        }

        [WebMethod]
        public static string GetCertificationsByCategory(string category)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
            
            string query = @"
                SELECT 
                    CertID,
                    CertTitle,
                    CertDescription,
                    CertImage,
                    IssuingOrganization,
                    IssueDate,
                    ExpiryDate,
                    CertificateLink,
                    CertType,
                    CredentialID,
                    IsFeatured,
                    DisplayOrder
                FROM CertificationsAchievements 
                WHERE IsActive = 1";

            if (!string.IsNullOrEmpty(category) && category != "all")
            {
                query += " AND CertType = @CertType";
            }

            query += " ORDER BY IsFeatured DESC, DisplayOrder, IssueDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (!string.IsNullOrEmpty(category) && category != "all")
                    {
                        cmd.Parameters.AddWithValue("@CertType", category);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var certifications = new List<object>();
                        
                        while (reader.Read())
                        {
                            certifications.Add(new
                            {
                                CertID = reader["CertID"],
                                CertTitle = reader["CertTitle"].ToString(),
                                CertDescription = reader["CertDescription"].ToString(),
                                CertImage = reader["CertImage"].ToString(),
                                IssuingOrganization = reader["IssuingOrganization"].ToString(),
                                IssueDate = reader["IssueDate"],
                                ExpiryDate = reader["ExpiryDate"],
                                CertificateLink = reader["CertificateLink"].ToString(),
                                CertType = reader["CertType"].ToString(),
                                CredentialID = reader["CredentialID"].ToString(),
                                IsFeatured = reader["IsFeatured"],
                                DisplayOrder = reader["DisplayOrder"]
                            });
                        }

                        return new JavaScriptSerializer().Serialize(new { success = true, data = certifications });
                    }
                }
            }
        }

    [WebMethod]
    [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public static string SendContactMessage(string name, string email, string subject, string message)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    INSERT INTO ContactMessages 
                    (Name, Email, Subject, Message, IPAddress, UserAgent, CreatedDate, IsRead) 
                    VALUES 
                    (@Name, @Email, @Subject, @Message, @IPAddress, @UserAgent, GETDATE(), 0)";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Name", name ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Email", email ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Subject", subject ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Message", message ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IPAddress", System.Web.HttpContext.Current.Request.UserHostAddress ?? string.Empty);
                        cmd.Parameters.AddWithValue("@UserAgent", System.Web.HttpContext.Current.Request.UserAgent ?? string.Empty);

                        int result = 0;
                        try
                        {
                            conn.Open();
                            // Ensure table exists before inserting to avoid runtime failures on fresh DBs
                            EnsureContactMessagesTableExists(conn);
                            result = cmd.ExecuteNonQuery();
                        }
                        catch (Exception dbEx)
                        {
                            // Fallback: persist to file so the user doesn't lose the message
                            try 
                            { 
                                LogErrorToFile("SendContactMessage_DB", dbEx);
                                SaveContactToFile(
                                    name ?? string.Empty,
                                    email ?? string.Empty,
                                    string.IsNullOrWhiteSpace(subject) ? "Portfolio Contact" : subject,
                                    message ?? string.Empty,
                                    System.Web.HttpContext.Current.Request.UserHostAddress ?? string.Empty,
                                    System.Web.HttpContext.Current.Request.UserAgent ?? string.Empty
                                );
                                // Treat as saved
                                result = 1;
                            }
                            catch (Exception fileEx)
                            {
                                // If even file fallback fails, rethrow to outer handler
                                LogErrorToFile("SendContactMessage_FileFallback", fileEx);
                                throw;
                            }
                        }

                        if (result > 0)
                        {
                            // Attempt to send an email notification to site owner
                            try
                            {
                                var toEmail = ConfigurationManager.AppSettings["ContactToEmail"] ?? "hasan2107064@stud.kuet.ac.bd";
                                var smtpHost = ConfigurationManager.AppSettings["SmtpHost"];
                                var smtpPortStr = ConfigurationManager.AppSettings["SmtpPort"];
                                var smtpUser = ConfigurationManager.AppSettings["SmtpUser"];
                                var smtpPass = ConfigurationManager.AppSettings["SmtpPass"];
                                var smtpSslStr = ConfigurationManager.AppSettings["SmtpEnableSsl"];
                                var fromEmail = ConfigurationManager.AppSettings["SmtpFrom"] ?? (string.IsNullOrEmpty(smtpUser) ? "no-reply@localhost" : smtpUser);

                                int smtpPort = 25;
                                int.TryParse(smtpPortStr, out smtpPort);
                                bool enableSsl = true;
                                bool.TryParse(smtpSslStr, out enableSsl);

                                // Build subject/body with sensible defaults
                                string safeSubject = string.IsNullOrWhiteSpace(subject) ? ($"Portfolio Contact - {name}") : subject;
                                var encodedMessage = System.Web.HttpUtility.HtmlEncode(message ?? string.Empty).Replace("\n", "<br/>");
                                string htmlBody = $@"<h2>New Contact Message</h2>
<p><strong>Name:</strong> {System.Web.HttpUtility.HtmlEncode(name)}</p>
<p><strong>Email:</strong> {System.Web.HttpUtility.HtmlEncode(email)}</p>
<p><strong>Subject:</strong> {System.Web.HttpUtility.HtmlEncode(safeSubject)}</p>
<p><strong>Message:</strong><br/>{encodedMessage}</p>
<hr/><p style='color:#888'><small>IP: {System.Web.HttpContext.Current.Request.UserHostAddress} | UA: {System.Web.HttpContext.Current.Request.UserAgent}</small></p>";

                                if (!string.IsNullOrWhiteSpace(smtpHost))
                                {
                                    using (var mail = new MailMessage())
                                    {
                                        mail.To.Add(new MailAddress(toEmail));
                                        mail.From = new MailAddress(fromEmail, "Portfolio Website");
                                        mail.Subject = safeSubject;
                                        mail.Body = htmlBody;
                                        mail.IsBodyHtml = true;

                                        using (var smtp = new SmtpClient(smtpHost, smtpPort))
                                        {
                                            smtp.EnableSsl = enableSsl;
                                            if (!string.IsNullOrEmpty(smtpUser))
                                            {
                                                smtp.Credentials = new NetworkCredential(smtpUser, smtpPass ?? string.Empty);
                                            }
                                            smtp.Send(mail);
                                        }
                                    }
                                }
                            }
                            catch (Exception mailEx)
                            {
                                // Do not fail the API if email fails; just log
                                try 
                                { 
                                    System.Diagnostics.Debug.WriteLine($"Email send error: {mailEx.Message}"); 
                                    LogErrorToFile("SendContactMessage_Email", mailEx);
                                } 
                                catch { }
                            }

                            return new JavaScriptSerializer().Serialize(new 
                            { 
                                success = true, 
                                message = "Thank you for your message! I'll get back to you soon." 
                            });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new 
                            { 
                                success = false, 
                                message = "Failed to send message. Please try again." 
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error to file for troubleshooting
                try { LogErrorToFile("SendContactMessage", ex); } catch { }

                // If debug enabled, surface a hint for easier diagnosis (only on local/dev)
                bool debug = false; bool.TryParse(ConfigurationManager.AppSettings["EnableDebugMode"], out debug);
                var userMsg = debug 
                    ? ($"Error: {ex.Message}") 
                    : "An error occurred while sending your message. Please try again later.";

                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = userMsg 
                });
            }
        }

        #endregion

        #region Helper Methods
        private static void SaveContactToFile(string name, string email, string subject, string message, string ip, string ua)
        {
            var ctx = System.Web.HttpContext.Current;
            var baseDir = ctx != null 
                ? ctx.Server.MapPath("~/App_Data")
                : Path.Combine(AppDomain.CurrentDomain.BaseDirectory ?? "", "App_Data");
            Directory.CreateDirectory(baseDir);
            var filePath = Path.Combine(baseDir, "contact_fallback.csv");
            var now = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            // Basic CSV escaping by wrapping fields in quotes and doubling internal quotes
            var fields = new [] { CsvEscape(now), CsvEscape(name), CsvEscape(email), CsvEscape(subject), CsvEscape(message), CsvEscape(ip), CsvEscape(ua) };
            var line = string.Join(",", fields) + "\r\n";
            File.AppendAllText(filePath, line);
        }

        private static string CsvEscape(string s)
        {
            return "\"" + (s ?? string.Empty).Replace("\"", "\"\"") + "\"";
        }
        private static void EnsureContactMessagesTableExists(SqlConnection conn)
        {
            // Uses existing open connection. Creates table if missing.
            const string ensureSql = @"
IF OBJECT_ID(N'dbo.ContactMessages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ContactMessages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NULL,
        Email NVARCHAR(256) NULL,
        Subject NVARCHAR(200) NULL,
        Message NVARCHAR(MAX) NULL,
        IPAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(512) NULL,
        CreatedDate DATETIME NOT NULL DEFAULT(GETDATE()),
        IsRead BIT NOT NULL DEFAULT(0)
    );
END";

            using (var ensureCmd = new SqlCommand(ensureSql, conn))
            {
                ensureCmd.ExecuteNonQuery();
            }
        }

        private static void LogErrorToFile(string method, Exception ex)
        {
            try
            {
                var ctx = System.Web.HttpContext.Current;
                var path = ctx != null 
                    ? ctx.Server.MapPath("~/App_Data/error_log.txt")
                    : Path.Combine(AppDomain.CurrentDomain.BaseDirectory ?? "", "App_Data", "error_log.txt");
                var ip = ctx?.Request?.UserHostAddress ?? "";
                var ua = ctx?.Request?.UserAgent ?? "";
                var stamp = DateTime.Now.ToString();
                var entry = $"{stamp}: {method} - {ex.Message}\r\n{ex}\r\nIP:{ip} UA:{ua}\r\n\r\n";
                Directory.CreateDirectory(Path.GetDirectoryName(path));
                File.AppendAllText(path, entry);
            }
            catch
            {
                // Swallow to avoid secondary failures
            }
        }

        private void RegisterClientScripts()
        {
            // Register portfolio data as JavaScript variables
            if (ViewState["SkillsData"] != null)
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "SkillsData", 
                    $"window.portfolioSkills = {ViewState["SkillsData"]};", true);
            }

            if (ViewState["ProjectsData"] != null)
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "ProjectsData", 
                    $"window.portfolioProjects = {ViewState["ProjectsData"]};", true);
            }

            if (ViewState["CertificationsData"] != null)
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "CertificationsData", 
                    $"window.portfolioCertifications = {ViewState["CertificationsData"]};", true);
            }

            if (ViewState["PersonalInfo"] != null)
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "PersonalInfo", 
                    $"window.personalInfo = {ViewState["PersonalInfo"]};", true);
            }
        }

        private void LogError(string method, Exception ex)
        {
            try
            {
                string query = @"
                    INSERT INTO ErrorLogs 
                    (ErrorMessage, StackTrace, Source, Method, UserAgent, IPAddress, CreatedDate) 
                    VALUES 
                    (@ErrorMessage, @StackTrace, @Source, @Method, @UserAgent, @IPAddress, GETDATE())";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ErrorMessage", ex.Message);
                        cmd.Parameters.AddWithValue("@StackTrace", ex.StackTrace ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Source", ex.Source ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Method", method);
                        cmd.Parameters.AddWithValue("@UserAgent", Request.UserAgent ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IPAddress", Request.UserHostAddress ?? string.Empty);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                // If logging fails, write to event log or file
                System.IO.File.AppendAllText(
                    Server.MapPath("~/App_Data/error_log.txt"),
                    $"{DateTime.Now}: {method} - {ex.Message}\n{ex.StackTrace}\n\n"
                );
            }
        }

        private void ShowErrorMessage(string message)
        {
            Page.ClientScript.RegisterStartupScript(this.GetType(), "ErrorMessage", 
                $"console.error('{message}'); if(window.showNotification) window.showNotification('{message}', 'error');", true);
        }

        protected string GetFormattedDate(object dateValue)
        {
            if (dateValue == null || dateValue == DBNull.Value)
                return "Present";

            DateTime date = Convert.ToDateTime(dateValue);
            return date.ToString("MMM yyyy");
        }

        protected string GetRelativeTime(object dateValue)
        {
            if (dateValue == null || dateValue == DBNull.Value)
                return "";

            DateTime date = Convert.ToDateTime(dateValue);
            TimeSpan timeSpan = DateTime.Now - date;

            if (timeSpan.Days > 365)
                return $"{timeSpan.Days / 365} year{(timeSpan.Days / 365 > 1 ? "s" : "")} ago";
            if (timeSpan.Days > 30)
                return $"{timeSpan.Days / 30} month{(timeSpan.Days / 30 > 1 ? "s" : "")} ago";
            if (timeSpan.Days > 0)
                return $"{timeSpan.Days} day{(timeSpan.Days > 1 ? "s" : "")} ago";
            if (timeSpan.Hours > 0)
                return $"{timeSpan.Hours} hour{(timeSpan.Hours > 1 ? "s" : "")} ago";
            if (timeSpan.Minutes > 0)
                return $"{timeSpan.Minutes} minute{(timeSpan.Minutes > 1 ? "s" : "")} ago";

            return "Just now";
        }

        protected string GetProficiencyBadgeClass(object proficiency)
        {
            if (proficiency == null) return "badge";

            string level = proficiency.ToString().ToLower();
            return $"badge {level}";
        }

        protected string GetStatusBadgeClass(object status)
        {
            if (status == null) return "badge";

            string statusValue = status.ToString().ToLower();
            switch (statusValue)
            {
                case "completed":
                    return "badge success";
                case "in progress":
                    return "badge warning";
                case "planned":
                    return "badge info";
                default:
                    return "badge";
            }
        }

        #endregion

        #region Page Events

        protected void Page_PreRender(object sender, EventArgs e)
        {
            // Add any pre-render logic here
            RegisterClientScripts();
        }

        protected void Page_Error(object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError();
            LogError("Page_Error", ex);
            Server.ClearError();
            Response.Redirect("~/error.aspx");
        }

        #endregion
    }
}
