namespace StudyBuddy
{
    public class StudyOutput
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public OutputType Type { get; set; }
    }

    public enum OutputType
    {
        Summary,
        Quiz,
        Mnemonics
    }

    public class LanguageOption
    {
        public string Code { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;

        public override string ToString()
        {
            return DisplayName;
        }
    }
}