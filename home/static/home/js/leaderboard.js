function sortTable(n, element) {
  $(element).addClass('data-col-active').siblings().removeClass('data-col-active');

  var table, switching, i, x, y, shouldSwitch, switchcount = 0;
  table = document.getElementById("leaderboard");
  var rows = table.rows;
  for(i=0; i<rows.length; i++) {
    $(rows[i]).children(`:nth-child(${n+1})`).addClass('data-col-active').children('a').addClass('data-col-active');
    $(rows[i]).children(`:nth-child(${n+1})`).siblings().removeClass('data-col-active').children('a').removeClass('data-col-active');
  }
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (Number(x.innerText) < Number(y.innerText)) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      } 
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      $(rows[i]).children().first().text(i + '.');
      $(rows[i+1]).children().first().text((i+1) + '.');
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    }
  }
    
}