using System.Windows;
using Prism.Ioc;
using Prism.Regions;

namespace ADOC.Infrastructure.WPF.Popup.Internal;

public class PopupService : IPopupService
{
    readonly IContainerProvider mServices;
    readonly Dictionary<object, Window?> mPopupOpenedDic = new();
    readonly Dictionary<Window, object> mWindow2ID = new();

    public PopupService(IContainerProvider service)
    {
        mServices = service;
    }

    public Window? OpenWindow<VT, WT>(PopupParameters parameters, Action<PopupResult>? results = null)
        where VT : FrameworkElement
        where WT : Window, IPopupWindow
    {
        object ID = parameters.ID != null ? parameters.ID : typeof(VT);

        if (mPopupOpenedDic.TryGetValue(ID, out Window? cachedWindow))
        {
            if (cachedWindow is not null)
            {
                if (cachedWindow.Content is FrameworkElement vview && vview.DataContext is IPopupViewModel ddvm)
                {
                    ddvm.OnPopupOpened(parameters);
                }
                return null;
            }
        }
        mPopupOpenedDic.TryAdd(ID, null);

        windowInit<VT, WT>(out var view, out var window);
        window.Parameters = parameters;

        if (view.DataContext is IPopupViewModel dvm)
        {
            Action<PopupResult>? requestClose = null;
            requestClose = (r) => { window.Result = r; window.Close(); results?.Invoke(r); dvm.OnPopupClosed(r); dvm.RequestClose -= requestClose; };

            dvm.RequestClose += requestClose;
            dvm.OnPopupOpened(parameters);
            window.Title = dvm.Title;
            window.Show();
        }
        else
        {
            window.Show();
        }

        if (ID != null)
        {
            mPopupOpenedDic[ID] = window;
            mWindow2ID[window] = ID;
        }

        return window;
    }

    public PopupResult? OpenDialog<VT, WT>(PopupParameters parameters, Action<PopupResult>? results)
        where VT : FrameworkElement
        where WT : Window, IPopupWindow
    {
        object ID = parameters.ID != null ? parameters.ID : typeof(VT);
        if (mPopupOpenedDic.TryGetValue(ID, out Window? cachedWindow))
        {
            if (cachedWindow is not null)
            {
                if (cachedWindow.Content is FrameworkElement vview && vview.DataContext is IPopupViewModel ddvm)
                {
                    ddvm.OnPopupOpened(parameters);
                }
                return null;
            }
        }
        mPopupOpenedDic.TryAdd(ID, null);

        windowInit<VT, WT>(out var view, out var window);
        window.Parameters = parameters;

        if (parameters.ID != null)
        {
            mPopupOpenedDic[ID] = window;
            mWindow2ID[window] = ID;
        }

        if (view.DataContext is IPopupViewModel dvm)
        {
            Action<PopupResult>? requestClose = null;
            requestClose = (r) => { window.Result = r; window.Close(); results?.Invoke(r); dvm.OnPopupClosed(r); dvm.RequestClose -= requestClose; };

            dvm.RequestClose += requestClose;
            dvm.OnPopupOpened(parameters);
            window.Title = dvm.Title;
            window.ShowDialog();
        }
        else
        {
            window.ShowDialog();
        }

        if (parameters.ID != null)
        {
            mPopupOpenedDic.Remove(parameters.ID);
            mWindow2ID.Remove(window);
        }

        return window.Result;
    }
    public bool IsPopupOpened()
    {
        foreach (var pair in mPopupOpenedDic)
        {
            if (pair.Value != null) return true;
        }
        return false;
    }
    public bool IsPopupOpened(object ID)
        => mPopupOpenedDic.TryGetValue(ID, out Window? dialog) && dialog is not null;
    public IEnumerable<object> GetOpenedPopupIDs() => mPopupOpenedDic.Keys.Where((id) => IsPopupOpened(id));
    public void ClosePopup(object ID)
    {
        if (ID == null) return;

        if (mPopupOpenedDic.TryGetValue(ID, out Window? window))
        {
            window?.Close();
            mPopupOpenedDic.Remove(ID);
        }
    }
    public void CloseAllPopups()
    {
        foreach (var pair in mPopupOpenedDic)
        {
            Window? window = pair.Value;
            window?.Close();
        }
        mPopupOpenedDic.Clear();
    }
    void windowInit<VT, WT>(out VT view, out WT window) where VT : FrameworkElement where WT : Window
    {
        window = mServices.Resolve<WT>()!;
        view = mServices.Resolve<VT>()!;

        RegionManager.SetRegionManager(view, mServices.Resolve<IRegionManager>());

        window.Owner = Application.Current.MainWindow;
        window.Content = view;
        window.Closed += onWindowClosed;
    }
    void onWindowClosed(object? s, EventArgs e)
    {
        if (s is Window window && mWindow2ID.TryGetValue(window, out object? id))
        {
            mWindow2ID.Remove(window);
            mPopupOpenedDic.Remove(id);
        }
    }
}
