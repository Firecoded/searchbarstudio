<?php
/**
 * Searchbar Studio footer credit (WordPress, update-safe).
 *
 * Two ways to use this:
 *   1. Paste the add_action(...) block into the active theme's functions.php.
 *   2. Better: save this whole file as
 *      wp-content/mu-plugins/searchbar-credit.php
 *      so it loads as a must-use plugin and survives theme switches/updates.
 *
 * It hooks wp_footer, which renders just before </body> (outside the footer
 * element), so the text color is set explicitly here rather than inherited.
 * Default is tuned for a LIGHT footer; for a DARK footer, change #9a8c7b to a
 * light grey like #b9ada0. Keep the markup in sync with footer-credit.html
 * (that file is the source of truth).
 */

add_action( 'wp_footer', function () {
	?>
	<p style="margin:0;padding:12px 0;text-align:center;font:400 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#9a8c7b;">
		Site by <a href="https://searchbarstudio.com" target="_blank" rel="noopener" style="color:#c1592f;text-decoration:none;">Searchbar Studio</a>
	</p>
	<?php
} );
