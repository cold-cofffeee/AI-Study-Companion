using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace StudyBuddy.Helpers
{
    /// <summary>
    /// Enhanced API client for Google Gemini AI integration
    /// Handles all AI-related API calls with proper error handling and fallback mechanisms
    /// </summary>
    public class GeminiApiClient : IDisposable
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        
        // TODO: Replace with real Google Gemini API endpoint and set Authorization header
        private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

        /// <summary>
        /// Initialize the Gemini API client with API key
        /// </summary>
        /// <param name="apiKey">Google Gemini API key</param>
        public GeminiApiClient(string apiKey)
        {
            _apiKey = apiKey;
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
            
            // Set the required headers for Gemini API
            _httpClient.DefaultRequestHeaders.Add("X-goog-api-key", _apiKey);
        }

        /// <summary>
        /// Generate study summary with quiz questions and mnemonics
        /// </summary>
        /// <param name="text">Input text to summarize</param>
        /// <param name="language">Target language for response</param>
        /// <returns>JSON response with summary, quiz, and mnemonics</returns>
        public async Task<string> GenerateStudySummaryAsync(string text, string language = "en")
        {
            var languageInstruction = language != "en" ? $" Please respond in {GetLanguageName(language)}." : "";
            
            var prompt = $@"
                Analyze the following text and create a comprehensive study guide.{languageInstruction}
                
                Please format your response as JSON with the following structure:
                {{

                    ""summary"": [""bullet point 1"", ""bullet point 2"", ""bullet point 3""],
                    ""quiz"": [
                        {{
                            ""question"": ""Question text"",
                            ""options"": [""A. Option 1"", ""B. Option 2"", ""C. Option 3"", ""D. Option 4""],
                            ""answer_index"": 0,
                            ""explanation"": ""Explanation of correct answer""
                        }}
                    ],
                    ""mnemonics"": [""Memory trick 1"", ""Memory trick 2""]
                }}
                
                Text to analyze:
                {text}
            ";

            try
            {
                var response = await GenerateContentAsync(prompt);
                
                // Try to parse as JSON, if it fails, return fallback format
                if (IsValidJson(response))
                {
                    return response;
                }
                else
                {
                    // Convert plain text response to JSON format
                    return ConvertToStructuredJson(response, text);
                }
            }
            catch (Exception ex)
            {
                // Return offline fallback summary
                return CreateOfflineSummary(text, language);
            }
        }

        /// <summary>
        /// Generate random study problems
        /// </summary>
        /// <param name="subject">Subject (Math, Physics, Chemistry)</param>
        /// <param name="difficulty">Difficulty level (Easy, Medium, Hard)</param>
        /// <param name="count">Number of problems to generate</param>
        /// <param name="language">Target language</param>
        /// <returns>JSON array of problems</returns>
        public async Task<string> GenerateStudyProblemsAsync(string subject, string difficulty, int count, string language = "en")
        {
            var languageInstruction = language != "en" ? $" Please respond in {GetLanguageName(language)}." : "";
            
            var prompt = $@"
                Generate {count} {difficulty.ToLower()} level {subject} problems.{languageInstruction}
                
                Format as JSON array:
                [
                    {{
                        ""question"": ""Problem statement"",
                        ""solution"": ""Final answer"",
                        ""steps"": ""Step by step solution""
                    }}
                ]
                
                Make sure problems are educational and appropriate for the {difficulty} difficulty level.
            ";

            try
            {
                var response = await GenerateContentAsync(prompt);
                return EnsureJsonFormat(response, "problems");
            }
            catch (Exception)
            {
                // Return fallback problems
                return CreateFallbackProblems(subject, difficulty, count);
            }
        }

        /// <summary>
        /// Generate study schedule with Pomodoro technique
        /// </summary>
        /// <param name="topic">Study topic</param>
        /// <param name="availableMinutes">Available study time</param>
        /// <param name="difficulty">Content difficulty</param>
        /// <param name="language">Target language</param>
        /// <returns>JSON schedule with time blocks</returns>
        public async Task<string> GenerateStudyScheduleAsync(string topic, int availableMinutes, string difficulty, string language = "en")
        {
            var languageInstruction = language != "en" ? $" Please respond in {GetLanguageName(language)}." : "";
            
            var prompt = $@"
                Create an optimal study schedule for ""{topic}"" with {availableMinutes} minutes available.
                Content difficulty: {difficulty}.{languageInstruction}
                
                Use Pomodoro technique with adaptive blocks. Format as JSON:
                {{
                    ""schedule"": [
                        {{
                            ""type"": ""Study"",
                            ""duration_minutes"": 25,
                            ""description"": ""Focus on core concepts""
                        }},
                        {{
                            ""type"": ""Break"",
                            ""duration_minutes"": 5,
                            ""description"": ""Short break""
                        }}
                    ],
                    ""total_study_minutes"": 150,
                    ""total_break_minutes"": 30,
                    ""micro_quizzes"": [""Quick question 1"", ""Quick question 2""]
                }}
            ";

            try
            {
                var response = await GenerateContentAsync(prompt);
                return EnsureJsonFormat(response, "schedule");
            }
            catch (Exception)
            {
                return CreateFallbackSchedule(topic, availableMinutes);
            }
        }

        /// <summary>
        /// Generate a reverse quiz from provided answers/definitions
        /// </summary>
        public async Task<string> GenerateReverseQuizAsync(string answers)
        {
            var prompt = @"
Create multiple choice questions from the following answers/definitions. 
For each answer or fact provided, generate a question with 4 options where one is correct.

Rules:
1. Create clear, specific questions
2. Include 3 plausible but incorrect distractors  
3. Provide brief explanations for correct answers
4. Return as JSON array with this structure:

[
  {
    ""question"": ""What is the capital of France?"",
    ""options"": [""Paris"", ""London"", ""Berlin"", ""Madrid""],
    ""correct_index"": 0,
    ""explanation"": ""Paris has been the capital of France since 987 AD""
  }
]

Answers/definitions to convert into questions:
" + answers;

            return await GenerateContentAsync(prompt);
        }

        /// <summary>
        /// Core method to generate content via Gemini API
        /// </summary>
        /// <param name="prompt">Input prompt</param>
        /// <returns>AI-generated response</returns>
        public async Task<string> GenerateContentAsync(string prompt)
        {
            try
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };

                var json = JsonConvert.SerializeObject(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(BaseUrl, content);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var responseObj = JsonConvert.DeserializeObject<dynamic>(responseJson);
                    
                    if (responseObj?.candidates != null && responseObj.candidates.Count > 0)
                    {
                        var candidate = responseObj.candidates[0];
                        if (candidate?.content?.parts != null && candidate.content.parts.Count > 0)
                        {
                            var text = candidate.content.parts[0].text;
                            if (!string.IsNullOrEmpty(text?.ToString()))
                            {
                                return CleanApiResponse(text.ToString());
                            }
                        }
                    }

                    return "Error: No content generated by the API.";
                }
                else
                {
                    return GetErrorMessage(response.StatusCode, responseJson);
                }
            }
            catch (HttpRequestException ex)
            {
                return $"Network Error: {ex.Message}";
            }
            catch (TaskCanceledException)
            {
                return "Request timeout. Please try again.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        #region Helper Methods

        /// <summary>
        /// Clean API response from unwanted artifacts
        /// </summary>
        private string CleanApiResponse(string content)
        {
            if (string.IsNullOrEmpty(content)) return content;

            // Remove common AI response artifacts
            var lines = content.Split('\n');
            var cleanedLines = new List<string>();

            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                
                // Skip meta content and prompt artifacts
                if (trimmed.Contains("given the prompt") || 
                    trimmed.Contains("comprehensive bullet-point summary") ||
                    trimmed.Contains("needs to cover") ||
                    trimmed.Contains("(since the original prompt") ||
                    trimmed.Contains("*as if*") ||
                    trimmed.Contains("Implicitly Responded To") ||
                    trimmed.StartsWith("Okay,") ||
                    trimmed.All(c => c == '?' || c == '*' || c == '=' || c == '-' || char.IsWhiteSpace(c)) ||
                    string.IsNullOrWhiteSpace(trimmed))
                {
                    continue;
                }

                cleanedLines.Add(trimmed);
            }

            return string.Join("\n", cleanedLines);
        }

        /// <summary>
        /// Check if string is valid JSON
        /// </summary>
        private bool IsValidJson(string json)
        {
            try
            {
                JToken.Parse(json);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Convert plain text response to structured JSON
        /// </summary>
        private string ConvertToStructuredJson(string response, string originalText)
        {
            // Basic conversion to JSON format
            var summary = new List<string>();
            var quiz = new List<object>();
            var mnemonics = new List<string>();

            var lines = response.Split('\n');
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (!string.IsNullOrEmpty(trimmed))
                {
                    if (trimmed.StartsWith("•") || trimmed.StartsWith("-"))
                    {
                        summary.Add(trimmed.Substring(1).Trim());
                    }
                    else if (trimmed.Contains("?"))
                    {
                        quiz.Add(new
                        {
                            question = trimmed,
                            options = new[] { "A. True", "B. False", "C. Maybe", "D. Not applicable" },
                            answer_index = 0,
                            explanation = "Based on the provided text"
                        });
                    }
                    else if (trimmed.Length > 10)
                    {
                        mnemonics.Add(trimmed);
                    }
                }
            }

            if (summary.Count == 0)
            {
                summary = CreateFallbackSummary(originalText);
            }

            var result = new
            {
                summary = summary.Take(5).ToArray(),
                quiz = quiz.Take(3).ToArray(),
                mnemonics = mnemonics.Take(3).ToArray()
            };

            return JsonConvert.SerializeObject(result, Formatting.Indented);
        }

        /// <summary>
        /// Create offline fallback summary when API fails
        /// </summary>
        private string CreateOfflineSummary(string text, string language = "en")
        {
            var sentences = text.Split('.', StringSplitOptions.RemoveEmptyEntries);
            var summary = sentences.Take(3).Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();

            if (summary.Count == 0)
            {
                summary.Add("AI service unavailable - offline summary mode");
                summary.Add("Please review the original content manually");
                summary.Add("Try again when internet connection is restored");
            }

            var fallback = new
            {
                summary = summary.ToArray(),
                quiz = new[]
                {
                    new
                    {
                        question = "What is the main topic of this content?",
                        options = new[] { "A. Review required", "B. Content analysis", "C. Study material", "D. Learning objective" },
                        answer_index = 2,
                        explanation = "This content is study material for review"
                    }
                },
                mnemonics = new[] { "Remember to review this content regularly for better retention" }
            };

            return JsonConvert.SerializeObject(fallback, Formatting.Indented);
        }

        /// <summary>
        /// Create fallback summary from text
        /// </summary>
        private List<string> CreateFallbackSummary(string text)
        {
            var sentences = text.Split('.', StringSplitOptions.RemoveEmptyEntries);
            return sentences.Take(3).Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();
        }

        /// <summary>
        /// Ensure response is in proper JSON format
        /// </summary>
        private string EnsureJsonFormat(string response, string type)
        {
            if (IsValidJson(response)) return response;

            // Create fallback JSON based on type
            return type switch
            {
                "problems" => CreateFallbackProblems("General", "Medium", 1),
                "schedule" => CreateFallbackSchedule("Study Topic", 60),
                "quiz" => CreateFallbackQuiz("Sample content"),
                _ => response
            };
        }

        /// <summary>
        /// Create fallback problems when API fails
        /// </summary>
        private string CreateFallbackProblems(string subject, string difficulty, int count)
        {
            var problems = new List<object>();
            for (int i = 1; i <= count; i++)
            {
                problems.Add(new
                {
                    question = $"Sample {subject} problem #{i} ({difficulty} level)",
                    solution = "AI service unavailable - please generate problems manually",
                    steps = "1. Review the topic\n2. Practice similar problems\n3. Check your understanding"
                });
            }

            return JsonConvert.SerializeObject(problems, Formatting.Indented);
        }

        /// <summary>
        /// Create fallback study schedule
        /// </summary>
        private string CreateFallbackSchedule(string topic, int minutes)
        {
            var schedule = new
            {
                schedule = new[]
                {
                    new { type = "Study", duration_minutes = Math.Min(25, minutes / 2), description = $"Focus on {topic}" },
                    new { type = "Break", duration_minutes = 5, description = "Short break" },
                    new { type = "Study", duration_minutes = Math.Min(25, minutes / 2), description = "Review and practice" }
                },
                total_study_minutes = Math.Min(50, minutes),
                total_break_minutes = 5,
                micro_quizzes = new[] { "What did you just learn?", "How does this connect to previous knowledge?" }
            };

            return JsonConvert.SerializeObject(schedule, Formatting.Indented);
        }

        /// <summary>
        /// Create fallback quiz
        /// </summary>
        private string CreateFallbackQuiz(string content)
        {
            var quiz = new[]
            {
                new
                {
                    question = "What is the main concept in the provided content?",
                    options = new[] { "A. Primary topic", "B. Secondary detail", "C. Supporting information", "D. Background context" },
                    correct_index = 0,
                    explanation = "The main concept should be the primary focus of study"
                }
            };

            return JsonConvert.SerializeObject(quiz, Formatting.Indented);
        }

        /// <summary>
        /// Get language name from code
        /// </summary>
        private string GetLanguageName(string code)
        {
            return code switch
            {
                "es" => "Spanish",
                "fr" => "French",
                "de" => "German",
                "it" => "Italian",
                "pt" => "Portuguese",
                "ru" => "Russian",
                "ja" => "Japanese",
                "ko" => "Korean",
                "zh" => "Chinese",
                "bn" => "Bengali",
                _ => "English"
            };
        }

        /// <summary>
        /// Get error message from HTTP response
        /// </summary>
        private string GetErrorMessage(System.Net.HttpStatusCode statusCode, string responseJson)
        {
            try
            {
                var errorObj = JsonConvert.DeserializeObject<dynamic>(responseJson);
                var errorMessage = errorObj?.error?.message?.ToString();

                return statusCode switch
                {
                    System.Net.HttpStatusCode.Unauthorized => 
                        "Invalid API Key: Please check your Google Gemini API key.",
                    System.Net.HttpStatusCode.Forbidden => 
                        "Access Forbidden: API key may not have permission.",
                    System.Net.HttpStatusCode.TooManyRequests => 
                        "Rate limit exceeded. Please try again later.",
                    System.Net.HttpStatusCode.BadRequest => 
                        $"Bad Request: {errorMessage ?? "Invalid request format."}",
                    _ => 
                        $"API Error ({statusCode}): {errorMessage ?? "Unknown error occurred."}"
                };
            }
            catch
            {
                return $"HTTP Error {statusCode}: Failed to parse error response.";
            }
        }

        #endregion

        /// <summary>
        /// Test API key validity
        /// </summary>
        public async Task<bool> TestApiKeyAsync()
        {
            try
            {
                var response = await GenerateContentAsync("Test connection. Respond with 'OK' if this works.");
                return !response.StartsWith("Error:") && !response.StartsWith("Network Error:");
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Dispose resources
        /// </summary>
        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}