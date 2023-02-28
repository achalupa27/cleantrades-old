<div id='watchlistDropdown' class='watchlist-dropdown'>
<div class='wl-dropdown-card ct-card'>
    <div class='s-dropdown-flags'>
        <?php
            $flagColors = array('#22ab81', '#ff6571', '#0084ff', '#f94dff', '#fabc04', '#662d91', '#00deff');
                        // Green, Red, Blue, Magenta, Gold, Purple, Cyan
            foreach ($flagColors as &$color) {
                echo "
                    <div class='s-flag'>
                        <div class='c-flag'>
                            <svg class='svg-flag' fill=".$color." stroke=".$color." width='12' height='12'>
                                <path d='M 1,1 9,5 1,9 z'/>
                            </svg>
                        </div>
                    </div>
                ";
            }
        ?>
    </div>

    <div class='s-dropdown-hotlist'>
        <div class='volume-gainers hotlist-item-c'>
            <span class='txt-volume-gainers'>Volume</span>
        </div>
        <div class='percent-gainers hotlist-item-c'>
            <span class='txt-percent-gainers'>% Gainers</span>
        </div>
        <div class='percent-losers hotlist-item-c'>
            <span class='txt-percent-losers'>% Losers</span>
        </div>
    </div>

    <div class='dropdown-wl-header dropdown-item-header'>
        <div class='s-item-header-icon-text'>
            <div class='c-item-header-icon-text'>
                <div class='c-item-header-icon'>
                    <i class='fi fi-rr-list'></i>
                </div>
                <div class='c-item-header-text'>
                    <span class='txt-item-header'>Watchlists</span>
                </div>
            </div>
        </div>
        <div class='s-item-header-actions'>
            <div class='wl c-item-header-actions'>
                <div class='c-upload-wl dropdown-item-header-btn'>
                    <i class='fi fi-rr-upload'></i>
                </div>
                <div class='c-new-wl dropdown-item-header-btn'>
                    <i class='fi fi-rr-plus'></i>
                </div>
            </div>
        </div>
    </div>

    <div class='dropdown-wl-list'>
        <?php 
            $watchlists = array('Universe', 'Mining', 'Oil', 'Technology');
            foreach($watchlists as &$watchlist) {
                echo "
                    <div class='dropdown-item'>
                        <div class='wl-item-name'><span>".$watchlist."</span></div>
                        <div class='delete-wl'>
                            <i class='fi fi-rr-cross'></i>
                        </div>
                    </div>
                ";
            }
        ?>
    </div>

    <div class='dropdown-folder-header dropdown-item-header'>
        <div class='s-item-header-icon-text'>
            <div class='c-item-header-icon-text'>
                <div class='c-item-header-icon'>
                    <i class='fi fi-rr-folder'></i>
                </div>
                <div class='c-item-header-text'>
                    <span class='txt-item-header'>Folders</span>
                </div>
            </div>
        </div>
        <div class='s-item-header-actions'>
            <div class='wl c-item-header-actions'>
                <div class='c-new-wl'>
                    <i class='fi fi-rr-plus'></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class='dropdown-folder-list'>
        <?php 
            $folders = array('Energy', 'Finance');
            foreach($folders as &$folder) {
                echo "
                    <div class='dropdown-item'>
                        <div class='wl-item-name'><span>".$folder."</span></div>
                        <div class='delete-wl'><i class='fi fi-rr-cross'></i></div>
                    </div>
                ";
            }
        ?>
    </div>
    
    <div class='dropdown-scans-header dropdown-item-header'>
        <div class='s-item-header-icon-text'>
            <div class='c-item-header-icon-text'>
                <div class='c-item-header-icon'>
                    <i class='fi fi-rr-search-alt'></i>
                </div>
                <div class='c-item-header-text'>
                    <span class='txt-item-header'>Scans</span>
                </div>
            </div>
        </div>
        <div class='s-item-header-actions'>
            <div class='wl c-item-header-actions'>
                <div class='c-new-wl'>
                    <i class='fi fi-rr-plus'></i>
                </div>
            </div>
        </div>
    </div>
    <div class='dropdown-scans-list'>
        <?php 
            $scans = array('Premarket Gainers', 'Premarket Losers');
            foreach($scans as &$scan) {
                echo "
                    <div class='dropdown-item'>
                        <div class='wl-item-name'><span>".$scan."</span></div>
                        <div class='delete-wl'><i class='fi fi-rr-cross'></i></div>
                    </div>
                ";
            }
        ?>
    </div>
</div>
        </div>