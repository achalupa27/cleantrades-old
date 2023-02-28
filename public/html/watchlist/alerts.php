<div class='alerts-card' id='alertsCard' style='display:none'>
    <div class='alerts-header ct-card-header'>

        <div class='alerts-wl-toggle ct-card-header-btn-c'>
            <div class='alerts-wl-toggle-c ct-card-header-btn wl-toggle'>
                <i class='fi fi-rr-list'></i>
            </div>
        </div>

        <div class='alerts-card-header-title ct-card-header-title'>
            <div class='alerts-card-header-title-c ct-card-header-title-c'>
                <div class='alerts-name-c ct-card-header-name'>
                    <span>Alerts</span>
                </div>
            </div>
        </div>

        <div class='alerts-add-item ct-card-header-btn-c'>
            <div class='alerts-add-item-c ct-card-header-btn'>
                <i class='fi fi-rr-plus'></i>
            </div>
        </div>
    </div>

    <table class='alerts-table' style='width:100%'>
        <colgroup>
            <col style='width:5%'>
            <col style='width:70%'>
            <col style='width:20%'>
            <col style='width:5%'>
        </colgroup>  
        <tbody>
            <tr class='alert-item-header'>
                <td colspan='1'></td>
                <td colspan='2' scope='colgroup' class='triggered-alerts-label txt-item-header'>
                    <span>Triggered · 1</span>
                </td>
                <td colspan='1'></td>
            </tr>

            <?php
                $triggeredAlerts = array (
                    array('AAPL', 'apple.svg'),
                );
                foreach ($triggeredAlerts as &$triggeredAlert) {
                    echo "
                        <tr class='alert-item'>
                            <td colspan='1'></td>
                            <td class='symbol'>
                                <div class='logo-ticker'>
                                    <img class='logo' src='../img/".$triggeredAlert[1]."'></img>
                                    <span class='item-ticker'>".$triggeredAlert[0]."</span>
                                </div>
                            </td>
                            <td>
                                <div class='active-alerts__actions'>
                                    <div class='edit-active'><i class='fi fi-rr-rotate-right'></i></div>
                                    <div class='delete-active'><i class='fi fi-rr-cross'></i></div>
                                </div>
                            </td>
                            <td colspan='1'></td>
                        </tr>
                    ";
                }
            ?>

            <tr class='alert-item-header'>
                <td colspan='1'></td>
                <td colspan='2' scope='colgroup' class='active-alerts-label txt-item-header'>
                    <span>Active · 4</span>
                </td>
                <td colspan='1'></td>
            </tr>
            
            <?php
                $activeAlerts = array (
                    array('MSFT', 'microsoft.svg'),
                    array('FB', 'facebook.png'),
                    array('TWTR', 'twitter.svg')
                );
                foreach ($activeAlerts as &$activeAlert) {
                    echo "
                        <tr class='alert-item'>
                            <td colspan='1'></td>
                            <td class='symbol'>
                                <div class='logo-ticker'>
                                    <img class='logo' src='../img/".$activeAlert[1]."'></img>
                                    <span class='item-ticker'>".$activeAlert[0]."</span>
                                </div>
                            </td>
                            <td>
                                <div class='active-alerts__actions'>
                                    <div class='edit-active'><i class='fi fi-rr-pencil'></i></div>
                                    <div class='delete-active'><i class='fi fi-rr-cross'></i></div>
                                </div>
                            </td>
                            <td colspan='1'></td>
                        </tr>
                    ";
                }
            ?>

        </tbody>
    </table>
</div>