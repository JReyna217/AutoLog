namespace AutoLog.Domain.Exceptions;

/// <summary>
/// Custom exception used to throw controlled business logic errors.
/// The ErrorCode should map to the SystemResponses table.
/// </summary>
public class CustomAppException : Exception
{
    public string ErrorCode { get; }

    public CustomAppException(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }
}