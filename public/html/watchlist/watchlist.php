<div class='wl-card' id='watchlistCard'>
    <div class='wl-dropdown'>
        <div class='wl-header ct-card-header'>
            <div class='wl-alert-toggle ct-card-header-btn-c'>
                <div class='wl-alert-toggle-c ct-card-header-btn alert-toggle'>
                    <i class='fi fi-rr-alarm-clock'></i>
                </div>
            </div>
            <div class='wl-card-header-title ct-card-header-title'>
                <div class='wl-card-header-title-c ct-card-header-title-c'>
                    <div class='wl-prev-c ct-card-header-nav'>
                        <i class='fi fi-rr-angle-left'></i>
                    </div>
                    <div class='wl-name-c ct-card-header-name dropbtn' id='watchlistName'>
                        <span>Technology</span>
                    </div>
                    <div class='wl-next-c ct-card-header-nav'>
                        <i class='fi fi-rr-angle-right'></i>
                    </div>
                </div>
            </div>
            <div class='wl-add-item ct-card-header-btn-c'>
                <div class='wl-add-item-c ct-card-header-btn'>
                    <i class='fi fi-rr-plus'></i>
                </div>
            </div>
        </div>
        
        <?php include 'watchlist-dropdown.php'?>
    </div>

    <table class='wl-tbl' style='width: 100%'>
        <thead>
            <th style='width:5%'></th>
            <th style='width:35%'><span>Symbol</span></th>
            <th style='width:30%'><span>Last</span></th>
            <th style='width:25%'><span>% Change</span></th>
            <th style='width:5%'></th>
        </thead>

        <tbody class='watchlist-items' id='watchlistItems'>
        </tbody>
    </table>
</div>