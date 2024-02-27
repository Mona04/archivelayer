/// <summary>
/// Dialog Result.
/// </summary>
public enum EButtonResult
{
    None = 0,
    OK = 1,
    Cancel = 3,
    Apply = 3,
    No = 4,
}

public class PopupResult
{
    public Dictionary<string, object> Parameters { get; init; } = new();
    public EButtonResult ButtonResult { get; set; } = EButtonResult.None;
}
