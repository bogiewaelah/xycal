// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 6, 2012: Improve code readibility, Closure & Merged function
//              into Date object extension by GeekZy <geekzy@gmail.com>
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added 'NNN' formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
//
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  'MMM d, y' matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  'M/d/yy'   matches: 01/20/00
//                      9/2/00
//  'MMM dd, yyyy hh:mm:ssa' matches: 'January 01, 2000 12:30:45AM'
// ------------------------------------------------------------------

(function() {
    var LZ, _isInteger, _getInt,
        MONTH_NAMES = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        DAY_NAMES = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ],

    LZ = function(x) {
        return (x < 0 || x > 9 ? '' : '0' ) + x;
    };

    // ------------------------------------------------------------------
    // isDate ( date_string, format_string )
    // Returns true if date string matches format of format string and
    // is a valid date. Else returns false.
    // It is recommended that you trim whitespace around the value before
    // passing it to this function, as whitespace is NOT ignored!
    // ------------------------------------------------------------------
    Date.isDate = function(val, format) {
        var date = Date.parseDateFormat(val, format);
        return date !== 0;
    };

    // -------------------------------------------------------------------
    // compareDates(date1,date1format,date2,date2format)
    //   Compare two date strings to see which is greater.
    //   Returns:
    //   1 if date1 is greater than date2
    //   0 if date2 is greater than date1 of if they are the same
    //  -1 if either of the dates is in an invalid format
    // -------------------------------------------------------------------
    Date.compareDates = function(date1, dateformat1, date2, dateformat2) {
        var d1 = Date.parseDateFormat(date1, dateformat1),
            d2 = Date.parseDateFormat(date2, dateformat2);

        return (d1 === 0 || d2 === 0) ? -1 : (d1 > d2) ? 1 : 0;
    };

    // ------------------------------------------------------------------
    // formatDate (date_object, format)
    // Returns a date in the output format specified.
    // The format string uses the same abbreviations as in Date.parseDateFormat()
    // ------------------------------------------------------------------
    Date.prototype.formatDate = function(format) {
        format = format + '';
        var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k,
            result = '', i_format = 0, c = '', token = '', value = new Object(),
            y = this.getYear().toString(),
            M = this.getMonth() + 1,
            d = this.getDate(),
            E = this.getDay(),
            H = this.getHours(),
            m = this.getMinutes(),
            s = this.getSeconds();

        // Convert real date parts into formatted versions
        if (y.length < 4) { y = '' + (y - 0 + 1900); }
        value['y'] = '' + y;
        value['yyyy'] = y;
        value['yy'] = y.substring(2, 4);
        value['M'] = M;
        value['MM'] = LZ(M);
        value['MMM'] = MONTH_NAMES[M - 1];
        value['NNN'] = MONTH_NAMES[M + 11];
        value['d'] = d;
        value['dd'] = LZ(d);
        value['E'] = DAY_NAMES[E + 7];
        value['EE'] = DAY_NAMES[E];
        value['H'] = H;
        value['HH'] = LZ(H);

        if (H === 0) { value['h'] = 12; }
        else if (H > 12) { value['h'] = H - 12; }
        else { value['h'] = H; }
        value['hh'] = LZ(value['h']);

        if (H > 11) { value['K'] = H - 12; } else { value['K'] = H;}
        value['k'] = H + 1;
        value['KK'] = LZ(value['K']);
        value['kk'] = LZ(value['k']);

        if (H > 11) { value['a'] = 'PM'; }
        else { value['a'] = 'AM'; }
        value['m'] = m;
        value['mm'] = LZ(m);
        value['s'] = s;
        value['ss'] = LZ(s);

        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = '';
            while ((format.charAt(i_format) === c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) { result = result + value[token]; }
            else { result = result + token; }
        }
        return result;
    };

    // ------------------------------------------------------------------
    // Utility functions for parsing in Date.parseDateFormat()
    // ------------------------------------------------------------------
    _isInteger = function(val) {
        var digits = '1234567890';
        for (var i = 0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i)) === -1) { return false; }
        }
        return true;
    };

    _getInt = function(str, i, minlength, maxlength) {
        var x, token;
        for (x = maxlength; x >= minlength; x--) {
            token = str.substring(i, i+x);
            if (token.length < minlength) { return null; }
            if (_isInteger(token)) { return token; }
        }
        return null;
    };

    // ------------------------------------------------------------------
    // Date.parseDateFormat( date_string , format_string )
    //
    // This function takes a date string and a format string. It matches
    // If the date string matches the format string, it returns the
    // getTime() of the date. If it does not match, it returns 0.
    // ------------------------------------------------------------------
    Date.parseDateFormat = function(val,format) {
        val = val + '';
        format = format + '';
        var i, x, y, month_name, day_name, date = 1, i_val = 0, i_format = 0,
            newdate, c = '', token = '', token2 = '', ampm='',
            now = new Date(),
            year = now.getYear(),
            month = now.getMonth() + 1,
            hh = now.getHours(),
            mm = now.getMinutes(),
            ss = now.getSeconds();

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = '';
            while ((format.charAt(i_format) === c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token === 'yyyy' || token === 'yy' || token === 'y') {
                if (token === 'yyyy') { x = 4; y = 4; }
                if (token === 'yy')   { x = 2; y = 2; }
                if (token === 'y')    { x = 2; y = 4; }
                year = _getInt(val, i_val, x, y);                
                if (year === null) { return 0; }
                i_val += year.length;
                if (year.length === 2) {
                    if (year > 70) { year = 1900 + (year - 0); }
                    else { year = 2000 + (year - 0); }
                }
            }
            else if (token === 'MMM' || token === 'NNN') {
                month = 0;
                for (i = 0; i < MONTH_NAMES.length; i++) {
                    month_name = MONTH_NAMES[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() === month_name.toLowerCase()) {
                        if (token === 'MMM' || (token === 'NNN' && i > 11)) {
                            month = i + 1;
                            if (month > 12) { month -= 12; }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) { return 0; }
            }
            else if (token === 'EE' || token === 'E') {
                for (i = 0; i < DAY_NAMES.length; i++) {
                    day_name = DAY_NAMES[i];
                    if (val.substring(i_val,i_val+day_name.length).toLowerCase() === day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == 'MM' || token == 'M') {
                month = _getInt(val, i_val, token.length, 2);
                if (month === null || month < 1 || month > 12) { return 0; }
                i_val += month.length;
            }
            else if (token === 'dd' || token === 'd') {
                date = _getInt(val, i_val, token.length, 2);
                if (date === null || date < 1 || date > 31) { return 0; }
                i_val += date.length;
            }
            else if (token === 'hh' || token === 'h') {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh === null  ||  (hh < 1)  ||  (hh > 12)) { return 0; }
                i_val += hh.length;
            }
            else if (token === 'HH' || token === 'H') {
                hh = _getInt(val, i_val, token.length, 2);
                if(hh === null || (hh < 0) || (hh > 23)) { return 0; }
                i_val  +=  hh.length;
            }
            else if (token === 'KK' || token === 'K') {
                hh = _getInt(val, i_val, token.length, 2);
                if(hh === null || (hh < 0) || (hh > 11)) { return 0; }
                i_val += hh.length;
            }
            else if (token === 'kk' || token === 'k') {
                hh = _getInt(val, i_val, token.length, 2);
                if(hh === null || (hh < 1) || (hh > 24)) { return 0; }
                i_val += hh.length;hh--;
            }
            else if (token === 'mm' || token === 'm') {
                mm = _getInt(val, i_val, token.length, 2);
                if (mm === null || (mm < 0) || (mm > 59)) { return 0; }
                i_val += mm.length;
            }
            else if (token === 'ss' || token === 's') {
                ss = _getInt(val, i_val, token.length, 2);
                if (ss === null || (ss < 0) || (ss > 59)) { return 0; }
                i_val += ss.length;
            }
            else if (token === 'a') {
                if (val.substring(i_val, i_val+2).toLowerCase() === 'am') { ampm = 'AM'; }
                else if (val.substring(i_val, i_val+2).toLowerCase() === 'pm') { ampm = 'PM'; }
                else  { return 0; }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val+token.length)!=token)  { return 0; }
                else { i_val += token.length; }
            }
        }
        // If there are any trailing characters left in the value,  it doesn't match
        if (i_val != val.length) { return 0; }
        // Is date valid for month?
        if (month === 2) {
            // Check for leap year
            if (((year % 4 === 0) && (year % 100 != 0))  ||  (year % 400 === 0)) { // leap year
                if (date  >  29) { return 0; }
            }
            else if (date  >  28) { return 0; }
        }
        if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
            if (date  >  30) { return 0; }
            }
        // Correct hours value
        if (hh < 12 && ampm === 'PM') { hh = hh - 0 + 12; }
        else if (hh > 11 && ampm === 'AM') { hh -= 12; }
        
        newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate.getTime();
    };

    // ------------------------------------------------------------------
    // parseDate( date_string [,  prefer_euro_format] )
    //
    // This function takes a date string and tries to match it to a
    // number of possible date formats to get the value. It will try to
    // match against the following international formats,  in this order:
    // y-M-d   MMM d,  y   MMM d, y   y-MMM-d   d-MMM-y  MMM d
    // M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
    // d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
    // A second argument may be passed to instruct the method to search
    // for formats like d/M/y (european format) before M/d/y (American).
    // Returns a Date object or null if no patterns match.
    // ------------------------------------------------------------------
    Date.parseDate = function(val) {
        var i, j, l, d = null, preferEuro = (arguments.length === 2) ? arguments[1] : false,
            generalFormats = ['y-M-d', 'MMM d,  y', 'MMM d, y', 'y-MMM-d', 'd-MMM-y', 'MMM d'],
            monthFirst = ['M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d'],
            dateFirst = ['d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M'],
            checkList = [
                'generalFormats', 
                preferEuro ? 'dateFirst' : 'monthFirst', 
                preferEuro ? 'monthFirst' : 'dateFirst'
            ];
        
        for (i = 0; i < checkList.length; i++) {
            l = window[checkList[i]];
            for (j = 0; j < l.length; j++) {
                d = Date.parseDateFormat(val, l[j]);
                if (d != 0) { return new Date(d); }
            }
        }
        return null;
    };
})();