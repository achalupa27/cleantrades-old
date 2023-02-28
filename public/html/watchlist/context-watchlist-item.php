<div class='wl-item-context-wrapper ct-card'>
<div class='wl-item__context'>
    <div class='flags'>
        <?php
            $flagColors = array('#22ab81', '#ff6571', '#0084ff', '#f94dff', '#fabc04', '#662d91', '#00deff');
                        // Green, Red, Blue, Magenta, Gold, Purple, Cyan
            foreach ($flagColors as &$color) {
                echo "
                    <div class='s-flag'>
                        <div class='c-flag'>
                            <svg class='svg-flag-empty' fill='#fff' stroke=".$color." width='12' height='12'>
                                <path d='M 1,1 9,5 1,9 z'/>
                            </svg>
                        </div>
                    </div>
                ";
            }
        ?>
    </div>
    <div class='insert-category ct-context-item'>
        <span>Insert Category Above</span>
    </div>
    <div class='add-to-wl-x ct-context-item'>
        <div class='wl-icon ct-context-item-icon'>
            <i class='fi fi-rr-list'></i>
        </div>
        <div class='add-to-label'>
            <span>Add AAPL to...</span>
        </div>
    </div>
    <div class='add-note ct-context-item'>
        <div class='note-icon ct-context-item-icon'>
            <i class='fi fi-rr-notebook'></i>
        </div>
        <div class='add-to-label'>
            <span>Add Note for AAPL</span>
        </div>
    </div>
</div>
</div>