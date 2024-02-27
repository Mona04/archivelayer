using System.Windows;

namespace ADOC.Infrastructure.WPF.Popup;


/// <summary>
/// Send parameters using dictionary. 
/// </summary>
public class PopupParameters : Dictionary<string, object>
{
    public PopupParameters(object ID)
    {
        this.ID = ID;
    }
    public PopupParameters(object ID, Window owner)
    {
        this.ID = ID;
        this.Owner = owner;
    }
    public object ID { get; set; }
    public Window? Owner { get; set; }
}
namespace ADOC.Infrastructure.WPF.Popup;

public interface IPopupWindow
{
    PopupParameters Parameters { set; }
    PopupResult Result { get; set; }
}