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

                        // Bind to repeater control
                        SkillsRepeater.DataSource = skills;
                        SkillsRepeater.DataBind();

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
                    GitHubLink,
                    LiveDemoLink,
                    TechStack,
                    ProjectType,
                    StartDate,
                    EndDate,
                    IsCompleted,
                    IsFeatured,
                    DisplayOrder,
                    IsActive,
                    CreatedDate,
                    UpdatedDate
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
                                GitHubLink = reader["GitHubLink"].ToString(),
                                LiveDemoLink = reader["LiveDemoLink"].ToString(),
                                TechStack = reader["TechStack"].ToString(),
                                ProjectType = reader["ProjectType"].ToString(),
                                StartDate = reader["StartDate"],
                                EndDate = reader["EndDate"],
                                IsCompleted = reader["IsCompleted"],
                                IsFeatured = reader["IsFeatured"],
                                DisplayOrder = reader["DisplayOrder"],
                                CreatedDate = reader["CreatedDate"],
                                UpdatedDate = reader["UpdatedDate"]
                            });
                        }

                        // Bind to repeater control
                        ProjectsRepeater.DataSource = projects;
                        ProjectsRepeater.DataBind();

                        // Store in ViewState for JavaScript access
                        ViewState["ProjectsData"] = new JavaScriptSerializer().Serialize(projects);
                    }
                }
            }
        }

        private void LoadCertifications()
        {
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
                    DisplayOrder,
                    IsActive,
                    CreatedDate,
                    UpdatedDate
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
                                IssuingOrganization = reader["IssuingOrganization"].ToString(),
                                IssueDate = reader["IssueDate"],
                                ExpiryDate = reader["ExpiryDate"],
                                CertificateLink = reader["CertificateLink"].ToString(),
                                CertType = reader["CertType"].ToString(),
                                CredentialID = reader["CredentialID"].ToString(),
                                IsFeatured = reader["IsFeatured"],
                                DisplayOrder = reader["DisplayOrder"],
                                CreatedDate = reader["CreatedDate"],
                                UpdatedDate = reader["UpdatedDate"]
                            });
                        }

                        // Bind to repeater control
                        CertificationsRepeater.DataSource = certifications;
                        CertificationsRepeater.DataBind();

                        // Store in ViewState for JavaScript access
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

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
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
                // Log error (implement your logging mechanism)
                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = "An error occurred while sending your message. Please try again later." 
                });
            }
        }

        #endregion

        #region Helper Methods

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
