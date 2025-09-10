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
using System.Drawing;
using System.Drawing.Imaging;
using System.Web.Configuration;
using System.Web;
using System.Linq;

namespace PortfolioWebsite
{
    public partial class admin : System.Web.UI.Page
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
        private string adminUsername = ConfigurationManager.AppSettings["AdminUsername"];
        private string adminPassword = ConfigurationManager.AppSettings["AdminPassword"];
        private string secretKey = ConfigurationManager.AppSettings["SecretKey"];

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                CheckAuthenticationStatus();
                // If authenticated, load initial admin data for Repeaters
                if (Session["IsAdminAuthenticated"] != null && (bool)Session["IsAdminAuthenticated"])
                {
                    try { LoadAdminProjects(); } catch { }
                    try { LoadAdminCertifications(); } catch { }
                }
            }
        }

        #region Authentication Methods

        private void CheckAuthenticationStatus()
        {
            if (Session["IsAdminAuthenticated"] == null || !(bool)Session["IsAdminAuthenticated"])
            {
                // User not authenticated, show login form
                // This will be handled by JavaScript in the frontend
            }
            else
            {
                // User authenticated, load admin data
                LoadAdminDashboardData();
            }
        }

        // List image files under ~/img for admin pickers
        [WebMethod(EnableSession = true)]
        public static string ListImages()
        {
            try
            {
                // Optional auth check; comment out to allow unauthenticated preview
                if (HttpContext.Current.Session["IsAdminAuthenticated"] == null ||
                    !(bool)HttpContext.Current.Session["IsAdminAuthenticated"])
                {
                    return new JavaScriptSerializer().Serialize(new
                    {
                        success = false,
                        message = "Not authenticated",
                        images = new string[0]
                    });
                }

                var server = HttpContext.Current.Server;
                var root = server.MapPath("~/img");
                if (!Directory.Exists(root))
                {
                    return new JavaScriptSerializer().Serialize(new { success = true, images = new string[0] });
                }

                var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif" };
                var files = Directory.EnumerateFiles(root)
                    .Where(p => allowed.Contains(Path.GetExtension(p)))
                    .Select(p => "img/" + Path.GetFileName(p))
                    .OrderBy(p => p)
                    .ToList();

                return new JavaScriptSerializer().Serialize(new { success = true, images = files });
            }
            catch (Exception ex)
            {
                try { LogError("ListImages", ex); } catch { }
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to list images" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string AuthenticateAdmin(string username, string password)
        {
            try
            {
                string adminUser = ConfigurationManager.AppSettings["AdminUsername"];
                string adminPass = ConfigurationManager.AppSettings["AdminPassword"];

                if (username == adminUser && password == adminPass)
                {
                    System.Web.HttpContext.Current.Session["IsAdminAuthenticated"] = true;
                    System.Web.HttpContext.Current.Session["AdminUsername"] = username;
                    System.Web.HttpContext.Current.Session["LoginTime"] = DateTime.Now;
                    // Mark session active and set lightweight cookies for UI
                    try
                    {
                        System.Web.HttpContext.Current.Session["LastSeen"] = DateTime.Now;
                        SetCookie("AdminSession", Guid.NewGuid().ToString("N"), httpOnly: true);
                        SetCookie("AdminUI", "loggedIn", httpOnly: false);
                    }
                    catch { }

                    // Log successful login
                    LogAdminActivity("Login", "Successful admin login", username);

                    return new JavaScriptSerializer().Serialize(new 
                    { 
                        success = true, 
                        message = "Authentication successful",
                        redirectUrl = "admin.aspx"
                    });
                }
                else
                {
                    // Log failed login attempt
                    LogAdminActivity("Failed Login", "Invalid credentials", username);

                    return new JavaScriptSerializer().Serialize(new 
                    { 
                        success = false, 
                        message = "Invalid username or password" 
                    });
                }
            }
            catch (Exception ex)
            {
                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = "Authentication error occurred" 
                });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string ChangePassword(string currentPassword, string newPassword)
        {
            try
            {
                // Verify session
                if (System.Web.HttpContext.Current.Session["IsAdminAuthenticated"] == null || 
                    !(bool)System.Web.HttpContext.Current.Session["IsAdminAuthenticated"])
                {
                    return new JavaScriptSerializer().Serialize(new 
                    { 
                        success = false, 
                        message = "Not authenticated" 
                    });
                }

                string adminPass = ConfigurationManager.AppSettings["AdminPassword"];

                if (currentPassword == adminPass)
                {
                    // Persist new password in Web.config appSettings
                    bool updated = UpdateAppSetting("AdminPassword", newPassword);
                    if (updated)
                    {
                        LogAdminActivity("Password Change", "Password changed successfully",
                            System.Web.HttpContext.Current.Session["AdminUsername"].ToString());

                        return new JavaScriptSerializer().Serialize(new
                        {
                            success = true,
                            message = "Password changed successfully"
                        });
                    }
                    else
                    {
                        return new JavaScriptSerializer().Serialize(new
                        {
                            success = false,
                            message = "Failed to persist new password"
                        });
                    }
                }
                else
                {
                    return new JavaScriptSerializer().Serialize(new 
                    { 
                        success = false, 
                        message = "Current password is incorrect" 
                    });
                }
            }
            catch (Exception ex)
            {
                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = "Error changing password" 
                });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string ResetPasswordWithSecret(string secretKey, string newPassword)
        {
            try
            {
                string configSecretKey = ConfigurationManager.AppSettings["SecretKey"];

                if (secretKey == configSecretKey)
                {
                    bool updated = UpdateAppSetting("AdminPassword", newPassword);
                    if (updated)
                    {
                        LogAdminActivity("Password Reset", "Password reset using secret key", "admin");
                        return new JavaScriptSerializer().Serialize(new
                        {
                            success = true,
                            message = "Password reset successfully"
                        });
                    }
                    else
                    {
                        return new JavaScriptSerializer().Serialize(new
                        {
                            success = false,
                            message = "Failed to persist new password"
                        });
                    }
                }
                else
                {
                    return new JavaScriptSerializer().Serialize(new 
                    { 
                        success = false, 
                        message = "Invalid secret key" 
                    });
                }
            }
            catch (Exception ex)
            {
                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = "Error resetting password" 
                });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string Logout()
        {
            try
            {
                string username = System.Web.HttpContext.Current.Session["AdminUsername"]?.ToString() ?? "unknown";
                
                System.Web.HttpContext.Current.Session["IsAdminAuthenticated"] = false;
                System.Web.HttpContext.Current.Session.Clear();
                System.Web.HttpContext.Current.Session.Abandon();

                try
                {
                    ClearCookie("AdminSession");
                    ClearCookie("AdminUI");
                }
                catch { }

                LogAdminActivity("Logout", "Admin logged out", username);

                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = true, 
                    message = "Logged out successfully" 
                });
            }
            catch (Exception ex)
            {
                return new JavaScriptSerializer().Serialize(new 
                { 
                    success = false, 
                    message = "Error during logout" 
                });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string GetSessionInfo()
        {
            try
            {
                var ctx = System.Web.HttpContext.Current;
                bool isAuth = ctx.Session["IsAdminAuthenticated"] != null && (bool)ctx.Session["IsAdminAuthenticated"];
                string username = ctx.Session["AdminUsername"]?.ToString() ?? string.Empty;
                bool hasSessionCookie = ctx.Request.Cookies["ASP.NET_SessionId"] != null;
                bool hasAdminCookie = ctx.Request.Cookies["AdminSession"] != null;
                return new JavaScriptSerializer().Serialize(new
                {
                    success = true,
                    isAuthenticated = isAuth,
                    username = username,
                    serverTime = DateTime.Now.ToString("o"),
                    cookies = new { aspNetSession = hasSessionCookie, adminSession = hasAdminCookie }
                });
            }
            catch
            {
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Unable to get session info" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string KeepAlive()
        {
            try
            {
                System.Web.HttpContext.Current.Session["LastSeen"] = DateTime.Now;
                return new JavaScriptSerializer().Serialize(new { success = true, message = "OK" });
            }
            catch
            {
                return new JavaScriptSerializer().Serialize(new { success = false, message = "KeepAlive failed" });
            }
        }

        #endregion

        // Persist an appSetting value to Web.config
        private static bool UpdateAppSetting(string key, string value)
        {
            try
            {
                var config = WebConfigurationManager.OpenWebConfiguration("~");
                if (config.AppSettings.Settings[key] == null)
                {
                    config.AppSettings.Settings.Add(key, value);
                }
                else
                {
                    config.AppSettings.Settings[key].Value = value;
                }
                config.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection("appSettings");
                return true;
            }
            catch (Exception ex)
            {
                try { LogError($"UpdateAppSetting({key})", ex); } catch { }
                return false;
            }
        }

        #region CRUD Operations - Technical Skills

    [WebMethod(EnableSession = true)]
        public static string GetAllSkills()
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    SELECT 
                        SkillID, SkillName, CategoryName, SkillLevel, 
                        SkillDescription, IconImage, DisplayOrder, 
                        IsActive, CreatedDate, UpdatedDate
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
                                    IsActive = reader["IsActive"],
                                    CreatedDate = reader["CreatedDate"],
                                    UpdatedDate = reader["UpdatedDate"]
                                });
                            }

                            return new JavaScriptSerializer().Serialize(new { success = true, data = skills });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("GetAllSkills", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error retrieving skills" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string AddSkill(string skillName, string categoryName, string skillLevel, 
            string iconImage, string skillDescription, int displayOrder)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    INSERT INTO TechnicalSkills 
                    (SkillName, CategoryName, SkillLevel, IconImage, SkillDescription, DisplayOrder, IsActive, CreatedDate, UpdatedDate) 
                    VALUES 
                    (@SkillName, @CategoryName, @SkillLevel, @IconImage, @SkillDescription, @DisplayOrder, 1, GETDATE(), GETDATE())";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@SkillName", skillName);
                        cmd.Parameters.AddWithValue("@CategoryName", categoryName);
                        cmd.Parameters.AddWithValue("@SkillLevel", skillLevel);
                        cmd.Parameters.AddWithValue("@IconImage", iconImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@SkillDescription", skillDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Add Skill", $"Added skill: {skillName}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Skill added successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to add skill" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("AddSkill", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error adding skill" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string UpdateSkill(int skillId, string skillName, string categoryName, string skillLevel, 
            string iconImage, string skillDescription, int displayOrder, bool isActive)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    UPDATE TechnicalSkills 
                    SET SkillName = @SkillName, 
                        CategoryName = @CategoryName, 
                        SkillLevel = @SkillLevel, 
                        IconImage = @IconImage, 
                        SkillDescription = @SkillDescription, 
                        DisplayOrder = @DisplayOrder, 
                        IsActive = @IsActive, 
                        UpdatedDate = GETDATE() 
                    WHERE SkillID = @SkillID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@SkillID", skillId);
                        cmd.Parameters.AddWithValue("@SkillName", skillName);
                        cmd.Parameters.AddWithValue("@CategoryName", categoryName);
                        cmd.Parameters.AddWithValue("@SkillLevel", skillLevel);
                        cmd.Parameters.AddWithValue("@IconImage", iconImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@SkillDescription", skillDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                        cmd.Parameters.AddWithValue("@IsActive", isActive);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Update Skill", $"Updated skill: {skillName}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Skill updated successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to update skill" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("UpdateSkill", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error updating skill" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string DeleteSkill(int skillId)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                // Soft delete - just set IsActive to false
                string query = @"
                    UPDATE TechnicalSkills 
                    SET IsActive = 0, UpdatedDate = GETDATE() 
                    WHERE SkillID = @SkillID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@SkillID", skillId);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Delete Skill", $"Deleted skill ID: {skillId}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Skill deleted successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to delete skill" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("DeleteSkill", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error deleting skill" });
            }
        }

        #endregion

        #region CRUD Operations - Projects

    [WebMethod(EnableSession = true)]
        public static string GetAllProjects()
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    SELECT 
                        ProjectID, ProjectTitle, ProjectDescription, ProjectImage,
                        GitHubLink, LiveDemoLink, TechStack, ProjectType,
                        StartDate, EndDate, IsCompleted, IsFeatured, DisplayOrder,
                        IsActive, CreatedDate, UpdatedDate
                    FROM Projects 
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
                                    IsActive = reader["IsActive"],
                                    CreatedDate = reader["CreatedDate"],
                                    UpdatedDate = reader["UpdatedDate"]
                                });
                            }

                            return new JavaScriptSerializer().Serialize(new { success = true, data = projects });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("GetAllProjects", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error retrieving projects" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string AddProject(string projectTitle, string projectDescription, string projectImage,
            string gitHubLink, string liveDemoLink, string techStack, string projectType,
            string startDate, string endDate, bool isCompleted, bool isFeatured, int displayOrder)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    INSERT INTO Projects 
                    (ProjectTitle, ProjectDescription, ProjectImage, GitHubLink, LiveDemoLink, TechStack, 
                     ProjectType, StartDate, EndDate, IsCompleted, IsFeatured, DisplayOrder, IsActive, CreatedDate, UpdatedDate) 
                    VALUES 
                    (@ProjectTitle, @ProjectDescription, @ProjectImage, @GitHubLink, @LiveDemoLink, @TechStack, 
                     @ProjectType, @StartDate, @EndDate, @IsCompleted, @IsFeatured, @DisplayOrder, 1, GETDATE(), GETDATE())";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ProjectTitle", projectTitle);
                        cmd.Parameters.AddWithValue("@ProjectDescription", projectDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@ProjectImage", projectImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@GitHubLink", gitHubLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@LiveDemoLink", liveDemoLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@TechStack", techStack ?? string.Empty);
                        cmd.Parameters.AddWithValue("@ProjectType", projectType ?? "Web Development");
                        cmd.Parameters.AddWithValue("@StartDate", string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : DateTime.Parse(startDate));
                        cmd.Parameters.AddWithValue("@EndDate", string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : DateTime.Parse(endDate));
                        cmd.Parameters.AddWithValue("@IsCompleted", isCompleted);
                        cmd.Parameters.AddWithValue("@IsFeatured", isFeatured);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Add Project", $"Added project: {projectTitle}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Project added successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to add project" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("AddProject", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error adding project" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string UpdateProject(int projectId, string projectTitle, string projectDescription, string projectImage,
            string gitHubLink, string liveDemoLink, string techStack, string projectType,
            string startDate, string endDate, bool isCompleted, bool isFeatured, int displayOrder, bool isActive)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    UPDATE Projects 
                    SET ProjectTitle = @ProjectTitle, 
                        ProjectDescription = @ProjectDescription, 
                        ProjectImage = @ProjectImage, 
                        GitHubLink = @GitHubLink, 
                        LiveDemoLink = @LiveDemoLink, 
                        TechStack = @TechStack, 
                        ProjectType = @ProjectType, 
                        StartDate = @StartDate, 
                        EndDate = @EndDate, 
                        IsCompleted = @IsCompleted, 
                        IsFeatured = @IsFeatured, 
                        DisplayOrder = @DisplayOrder, 
                        IsActive = @IsActive, 
                        UpdatedDate = GETDATE() 
                    WHERE ProjectID = @ProjectID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ProjectID", projectId);
                        cmd.Parameters.AddWithValue("@ProjectTitle", projectTitle);
                        cmd.Parameters.AddWithValue("@ProjectDescription", projectDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@ProjectImage", projectImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@GitHubLink", gitHubLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@LiveDemoLink", liveDemoLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@TechStack", techStack ?? string.Empty);
                        cmd.Parameters.AddWithValue("@ProjectType", projectType ?? "Web Development");
                        cmd.Parameters.AddWithValue("@StartDate", string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : DateTime.Parse(startDate));
                        cmd.Parameters.AddWithValue("@EndDate", string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : DateTime.Parse(endDate));
                        cmd.Parameters.AddWithValue("@IsCompleted", isCompleted);
                        cmd.Parameters.AddWithValue("@IsFeatured", isFeatured);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                        cmd.Parameters.AddWithValue("@IsActive", isActive);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Update Project", $"Updated project: {projectTitle}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Project updated successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to update project" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("UpdateProject", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error updating project" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string DeleteProject(int projectId)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                // Hard delete as requested
                string query = @"DELETE FROM Projects WHERE ProjectID = @ProjectID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ProjectID", projectId);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Delete Project", $"Hard-deleted project ID: {projectId}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Project deleted successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to delete project" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("DeleteProject", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error deleting project" });
            }
        }

        #endregion

        #region CRUD Operations - Certifications

    [WebMethod(EnableSession = true)]
        public static string GetAllCertifications()
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    SELECT 
                        CertID, CertTitle, CertDescription, CertImage,
                        IssuingOrganization, IssueDate, ExpiryDate, CertificateLink,
                        CertType, CredentialID, IsFeatured, DisplayOrder,
                        IsActive, CreatedDate, UpdatedDate
                    FROM CertificationsAchievements 
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
                                    IsActive = reader["IsActive"],
                                    CreatedDate = reader["CreatedDate"],
                                    UpdatedDate = reader["UpdatedDate"]
                                });
                            }

                            return new JavaScriptSerializer().Serialize(new { success = true, data = certifications });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("GetAllCertifications", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error retrieving certifications" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string AddCertification(string certTitle, string certDescription, string certImage,
            string issuingOrganization, string issueDate, string expiryDate, string certificateLink,
            string certType, string credentialId, bool isFeatured, int displayOrder)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    INSERT INTO CertificationsAchievements 
                    (CertTitle, CertDescription, CertImage, IssuingOrganization, IssueDate, ExpiryDate, 
                     CertificateLink, CertType, CredentialID, IsFeatured, DisplayOrder, IsActive, CreatedDate, UpdatedDate) 
                    VALUES 
                    (@CertTitle, @CertDescription, @CertImage, @IssuingOrganization, @IssueDate, @ExpiryDate, 
                     @CertificateLink, @CertType, @CredentialID, @IsFeatured, @DisplayOrder, 1, GETDATE(), GETDATE())";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@CertTitle", certTitle);
                        cmd.Parameters.AddWithValue("@CertDescription", certDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@CertImage", certImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IssuingOrganization", issuingOrganization ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IssueDate", string.IsNullOrEmpty(issueDate) ? (object)DBNull.Value : DateTime.Parse(issueDate));
                        cmd.Parameters.AddWithValue("@ExpiryDate", string.IsNullOrEmpty(expiryDate) ? (object)DBNull.Value : DateTime.Parse(expiryDate));
                        cmd.Parameters.AddWithValue("@CertificateLink", certificateLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@CertType", certType ?? "Certification");
                        cmd.Parameters.AddWithValue("@CredentialID", credentialId ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IsFeatured", isFeatured);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Add Certification", $"Added certification: {certTitle}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Certification added successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to add certification" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("AddCertification", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error adding certification" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string UpdateCertification(int certId, string certTitle, string certDescription,
            string certImage, string issuingOrganization, string issueDate, string expiryDate,
            string certificateLink, string certType, string credentialId, bool isFeatured, int displayOrder, bool isActive)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    UPDATE CertificationsAchievements 
                    SET CertTitle = @CertTitle, 
                        CertDescription = @CertDescription, 
                        CertImage = @CertImage, 
                        IssuingOrganization = @IssuingOrganization, 
                        IssueDate = @IssueDate, 
                        ExpiryDate = @ExpiryDate, 
                        CertificateLink = @CertificateLink, 
                        CertType = @CertType, 
                        CredentialID = @CredentialID, 
                        IsFeatured = @IsFeatured, 
                        DisplayOrder = @DisplayOrder, 
                        IsActive = @IsActive, 
                        UpdatedDate = GETDATE() 
                    WHERE CertID = @CertID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@CertID", certId);
                        cmd.Parameters.AddWithValue("@CertTitle", certTitle);
                        cmd.Parameters.AddWithValue("@CertDescription", certDescription ?? string.Empty);
                        cmd.Parameters.AddWithValue("@CertImage", certImage ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IssuingOrganization", issuingOrganization ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IssueDate", string.IsNullOrEmpty(issueDate) ? (object)DBNull.Value : DateTime.Parse(issueDate));
                        cmd.Parameters.AddWithValue("@ExpiryDate", string.IsNullOrEmpty(expiryDate) ? (object)DBNull.Value : DateTime.Parse(expiryDate));
                        cmd.Parameters.AddWithValue("@CertificateLink", certificateLink ?? string.Empty);
                        cmd.Parameters.AddWithValue("@CertType", certType ?? "Certification");
                        cmd.Parameters.AddWithValue("@CredentialID", credentialId ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IsFeatured", isFeatured);
                        cmd.Parameters.AddWithValue("@DisplayOrder", displayOrder);
                        cmd.Parameters.AddWithValue("@IsActive", isActive);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Update Certification", $"Updated certification: {certTitle}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Certification updated successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to update certification" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("UpdateCertification", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error updating certification" });
            }
        }

    [WebMethod(EnableSession = true)]
        public static string DeleteCertification(int certId)
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                // Hard delete as requested
                string query = @"DELETE FROM CertificationsAchievements WHERE CertID = @CertID";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@CertID", certId);

                        conn.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            LogAdminActivity("Delete Certification", $"Hard-deleted certification ID: {certId}", GetCurrentUsername());
                            return new JavaScriptSerializer().Serialize(new { success = true, message = "Certification deleted successfully" });
                        }
                        else
                        {
                            return new JavaScriptSerializer().Serialize(new { success = false, message = "Failed to delete certification" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogError("DeleteCertification", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error deleting certification" });
            }
        }

        #endregion

        #region Dashboard Data

    [WebMethod(EnableSession = true)]
        public static string GetDashboardStats()
        {
            if (!IsAuthenticated()) return GetAuthError();

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    
                    var stats = new
                    {
                        TotalSkills = GetCount(conn, "TechnicalSkills"),
                        TotalProjects = GetCount(conn, "Projects"),
                        TotalCertifications = GetCount(conn, "CertificationsAchievements"),
                        TotalContactMessages = GetCount(conn, "ContactMessages"),
                        ActiveSkills = GetActiveCount(conn, "TechnicalSkills"),
                        ActiveProjects = GetActiveCount(conn, "Projects"),
                        ActiveCertifications = GetActiveCount(conn, "CertificationsAchievements"),
                        UnreadMessages = GetUnreadMessagesCount(conn)
                    };

                    return new JavaScriptSerializer().Serialize(new { success = true, data = stats });
                }
            }
            catch (Exception ex)
            {
                LogError("GetDashboardStats", ex);
                return new JavaScriptSerializer().Serialize(new { success = false, message = "Error retrieving dashboard stats" });
            }
        }

        private static int GetCount(SqlConnection conn, string tableName)
        {
            using (SqlCommand cmd = new SqlCommand($"SELECT COUNT(*) FROM {tableName}", conn))
            {
                return (int)cmd.ExecuteScalar();
            }
        }

        private static int GetActiveCount(SqlConnection conn, string tableName)
        {
            using (SqlCommand cmd = new SqlCommand($"SELECT COUNT(*) FROM {tableName} WHERE IsActive = 1", conn))
            {
                return (int)cmd.ExecuteScalar();
            }
        }

        private static int GetUnreadMessagesCount(SqlConnection conn)
        {
            using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM ContactMessages WHERE IsRead = 0", conn))
            {
                return (int)cmd.ExecuteScalar();
            }
        }

        #endregion

        #region Helper Methods

        private void LoadAdminDashboardData()
        {
            // Load dashboard data when admin is authenticated
            // This can be called from Page_Load after authentication check
            try { LoadAdminProjects(); } catch { }
            try { LoadAdminCertifications(); } catch { }
        }

        // Server-side data binders for admin Repeaters (initial render)
        private void LoadAdminProjects()
        {
            string query = @"
                SELECT 
                    ProjectID, ProjectTitle, ProjectDescription, ProjectImage,
                    GitHubLink, LiveDemoLink, TechStack, ProjectType,
                    IsCompleted
                FROM Projects 
                WHERE IsActive = 1
                ORDER BY IsFeatured DESC, DisplayOrder, CreatedDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    var table = new DataTable();
                    table.Load(reader);
                    var rpt = FindControl("rptAdminProjects") as Repeater;
                    if (rpt != null)
                    {
                        rpt.DataSource = table;
                        rpt.DataBind();
                    }
                }
            }
        }

        private void LoadAdminCertifications()
        {
            string query = @"
                SELECT 
                    CertID, CertTitle, CertDescription, CertImage,
                    IssuingOrganization, IssueDate, CertType
                FROM CertificationsAchievements 
                WHERE IsActive = 1 
                ORDER BY IsFeatured DESC, DisplayOrder, IssueDate DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    var table = new DataTable();
                    table.Load(reader);
                    var rpt = FindControl("rptAdminCertifications") as Repeater;
                    if (rpt != null)
                    {
                        rpt.DataSource = table;
                        rpt.DataBind();
                    }
                }
            }
        }

        private static bool IsAuthenticated()
        {
            return System.Web.HttpContext.Current.Session["IsAdminAuthenticated"] != null && 
                   (bool)System.Web.HttpContext.Current.Session["IsAdminAuthenticated"];
        }

        private static string GetAuthError()
        {
            return new JavaScriptSerializer().Serialize(new 
            { 
                success = false, 
                message = "Authentication required",
                requireAuth = true
            });
        }

        private static string GetCurrentUsername()
        {
            return System.Web.HttpContext.Current.Session["AdminUsername"]?.ToString() ?? "unknown";
        }

        private static void LogAdminActivity(string action, string description, string username)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
                string query = @"
                    INSERT INTO ActivityLog 
                    (AdminID, Action, TableName, RecordID, ActionDetails, IPAddress, UserAgent, ActionDate) 
                    VALUES 
                    (1, @Action, 'General', 0, @ActionDetails, @IPAddress, @UserAgent, GETDATE())";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Action", action);
                        cmd.Parameters.AddWithValue("@ActionDetails", $"{username}: {description}");
                        cmd.Parameters.AddWithValue("@IPAddress", System.Web.HttpContext.Current.Request.UserHostAddress ?? string.Empty);
                        cmd.Parameters.AddWithValue("@UserAgent", System.Web.HttpContext.Current.Request.UserAgent ?? string.Empty);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                // If logging fails, continue silently
            }
        }

        private static void LogError(string method, Exception ex)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["PortfolioConnectionString"].ConnectionString;
                
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
                        cmd.Parameters.AddWithValue("@UserAgent", System.Web.HttpContext.Current.Request.UserAgent ?? string.Empty);
                        cmd.Parameters.AddWithValue("@IPAddress", System.Web.HttpContext.Current.Request.UserHostAddress ?? string.Empty);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                // If logging fails, write to file
                try
                {
                    string logPath = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/error_log.txt");
                    File.AppendAllText(logPath, $"{DateTime.Now}: {method} - {ex.Message}\n{ex.StackTrace}\n\n");
                }
                catch { }
            }
        }

        // Cookie helpers
        private static void SetCookie(string name, string value, bool httpOnly = true, int? minutes = null)
        {
            var ctx = System.Web.HttpContext.Current;
            var cookie = new System.Web.HttpCookie(name, value)
            {
                HttpOnly = httpOnly,
                Secure = false,
                SameSite = System.Web.SameSiteMode.Lax
            };
            if (minutes.HasValue)
            {
                cookie.Expires = DateTime.Now.AddMinutes(minutes.Value);
            }
            ctx.Response.Cookies.Add(cookie);
        }

        private static void ClearCookie(string name)
        {
            var ctx = System.Web.HttpContext.Current;
            if (ctx.Request.Cookies[name] != null)
            {
                var cookie = new System.Web.HttpCookie(name)
                {
                    Expires = DateTime.Now.AddDays(-1),
                    Value = string.Empty
                };
                ctx.Response.Cookies.Add(cookie);
            }
        }

        #endregion

        #region Page Events

        protected void Page_PreRender(object sender, EventArgs e)
        {
            // Add any pre-render logic
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
