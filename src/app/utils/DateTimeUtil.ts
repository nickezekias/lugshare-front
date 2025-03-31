/**
 * DateTimeUtils provides static utility methods for date and time manipulation and formatting.
 */
export class DateTimeUtil {
  /**
   * Parses the input into a Date object.
   * Handles Date objects and strings/numbers that the Date constructor can parse.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns A valid Date object or null if parsing fails.
   * @private
   */
  private static _parseInput(input: Date | string | number): Date | null {
    let date: Date

    if (input instanceof Date) {
      date = input
    } else {
      // Try creating a date from string or number (timestamp)
      date = new Date(input)
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('DateTimeUtils: Invalid date input provided.', input)
      return null
    }

    return date
  }

  /**
   * Formats a date into YYYY-MM-DD format.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The formatted date string (e.g., "2025-03-30") or null if input is invalid.
   */
  static formatToYYYYMMDD(input: Date | string | number): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  /**
   * Formats a date into HH:MM:SS (24-hour) format.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The formatted time string (e.g., "16:20:54") or null if input is invalid.
   */
  static formatToTime(input: Date | string | number): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  /**
   * Formats a date into a common date and time string (YYYY-MM-DD HH:MM:SS).
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The formatted date and time string (e.g., "2025-03-30 16:20:54") or null if input is invalid.
   */
  static formatToDateTimeString(input: Date | string | number): string | null {
    const datePart = this.formatToYYYYMMDD(input)
    const timePart = this.formatToTime(input)

    if (!datePart || !timePart) return null

    return `${datePart} ${timePart}`
  }

  /**
   * Formats a date into ISO 8601 format (e.g., "2025-03-30T15:20:54.123Z").
   * Note: ISO string is always in UTC.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The ISO formatted date string or null if input is invalid.
   */
  static formatToISO(input: Date | string | number): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    return date.toISOString()
  }

  /**
   * Formats a date according to locale settings and specified options using Intl.DateTimeFormat.
   * This is the recommended way for flexible, locale-aware formatting using built-in JS capabilities.
   * @param input - The date value (Date object, string, or timestamp number).
   * @param options - Intl.DateTimeFormatOptions to customize the output (e.g., { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).
   * @param locale - Optional locale string (e.g., 'en-US', 'fr-FR', 'de-DE'). Defaults to system locale.
   * @returns The locale-formatted date/time string or null if input is invalid.
   * @example
   * // Get date like "March 30, 2025"
   * DateTimeUtils.formatToLocaleString(date, { year: 'numeric', month: 'long', day: 'numeric' }, 'en-US');
   * // Get time like "16:20"
   * DateTimeUtils.formatToLocaleString(date, { hour: '2-digit', minute: '2-digit', hour12: false });
   * // Get full date and time in German
   * DateTimeUtils.formatToLocaleString(date, { dateStyle: 'full', timeStyle: 'long' }, 'de-DE');
   */
  static formatToLocaleString(
    input: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
    locale?: string, // Defaults to the runtime's default locale
  ): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    try {
      // If no options provided, use default locale representation
      return date.toLocaleString(locale, options)
    } catch (error) {
      console.error('DateTimeUtils: Error formatting locale string.', error)
      // Fallback to default locale string if options/locale are invalid
      try {
        return date.toLocaleString()
      } catch (fallbackError) {
        console.error('DateTimeUtils: Error formatting locale string (fallback).', fallbackError)
        return null // Prevent crashing if even basic toLocaleString fails (highly unlikely)
      }
    }
  }

  /**
   * Formats only the date part of a date according to locale settings, omitting the time.
   * Uses `Intl.DateTimeFormat` with `dateStyle` options for locale-aware formatting.
   * @param input - The date value (Date object, string, or timestamp number).
   * @param dateStyle - The desired date style ('full', 'long', 'medium', 'short'). Defaults to 'medium'.
   * @param locale - Optional locale string (e.g., 'en-US', 'fr-FR', 'de-DE'). Defaults to system locale.
   * @returns The locale-formatted date string (without time) or null if input is invalid.
   * @example
   * // Assuming current locale is 'en-US' and date is March 30, 2025
   * DateTimeUtils.formatToLocalDateString(now); // "Mar 30, 2025" (medium)
   * DateTimeUtils.formatToLocalDateString(now, 'short'); // "3/30/25"
   * DateTimeUtils.formatToLocalDateString(now, 'long'); // "March 30, 2025"
   * DateTimeUtils.formatToLocalDateString(now, 'full'); // "Sunday, March 30, 2025"
   * DateTimeUtils.formatToLocalDateString(now, 'medium', 'fr-FR'); // "30 mars 2025"
   */
  static formatToLocalDateString(
    input: Date | string | number,
    dateStyle: 'full' | 'long' | 'medium' | 'short' = 'medium',
    locale?: string,
  ): string | null {
    // Reuse the main localeString formatter, providing specific options for date-only output
    return this.formatToLocaleString(input, { dateStyle: dateStyle }, locale)
  }

  /**
   * Formats a date by replacing tokens in a format string.
   * Supports common tokens: YYYY, YY, MM, M, DD, D, HH, H, hh, h, mm, m, ss, s, A, a.
   * Note: This provides basic formatting and does not handle locales or complex formats.
   * For robust formatting, prefer `formatToLocaleString` or dedicated libraries.
   * @param input - The date value (Date object, string, or timestamp number).
   * @param formatString - The string with tokens to replace (e.g., "YYYY/MM/DD hh:mm:ss A").
   * @returns The formatted string based on the formatString, or null if input is invalid.
   * @example
   * DateTimeUtils.formatByString(new Date(), "DD.MM.YYYY HH:mm"); // "30.03.2025 16:20"
   * DateTimeUtils.formatByString(new Date(), "MM/DD/YY h:m:s a"); // "03/30/25 4:20:54 pm"
   */
  static formatByString(input: Date | string | number, formatString: string): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate() // 1-31
    const hours = date.getHours() // 0-23
    const minutes = date.getMinutes() // 0-59
    const seconds = date.getSeconds() // 0-59

    // Helper for padding
    const pad = (num: number): string => String(num).padStart(2, '0')

    // Create replacement map - Process longer tokens first!
    const replacements: { [key: string]: string } = {
      YYYY: String(year),
      YY: String(year).slice(-2),
      MM: pad(month),
      M: String(month),
      DD: pad(day),
      D: String(day),
      HH: pad(hours), // 24-hour format
      H: String(hours),
      hh: pad(hours === 0 ? 12 : hours % 12 || 12), // 12-hour format
      h: String(hours === 0 ? 12 : hours % 12 || 12),
      mm: pad(minutes),
      m: String(minutes),
      ss: pad(seconds),
      s: String(seconds),
      A: hours < 12 ? 'AM' : 'PM',
      a: hours < 12 ? 'am' : 'pm',
    }

    let result = formatString
    // Iterate through the keys (tokens) and replace them in the format string
    // Using a regex with a function ensures we replace whole tokens
    result = result.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g, (match) => {
      return replacements[match]
    })

    return result
  }

  /**
   * Gets the epoch timestamp in milliseconds.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The number of milliseconds since the Unix Epoch, or null if input is invalid.
   */
  static getEpochMilliseconds(input: Date | string | number): number | null {
    const date = this._parseInput(input)
    if (!date) return null

    return date.getTime()
  }

  /**
   * Gets the epoch timestamp in seconds.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns The number of seconds since the Unix Epoch, or null if input is invalid.
   */
  static getEpochSeconds(input: Date | string | number): number | null {
    const date = this._parseInput(input)
    if (!date) return null

    return Math.floor(date.getTime() / 1000)
  }

  /**
   * Formats a date into a relative time string (e.g., "2 hours ago", "in 3 days").
   * Uses simplified logic for common intervals. For advanced internationalization, consider Intl.RelativeTimeFormat.
   * @param input - The date value (Date object, string, or timestamp number) to compare against.
   * @param baseDate - The reference date (defaults to the current time).
   * @returns A relative time string or null if input is invalid.
   */
  static formatRelativeTime(
    input: Date | string | number,
    baseDate: Date = new Date(),
  ): string | null {
    const date = this._parseInput(input)
    if (!date) return null

    const seconds = Math.round((baseDate.getTime() - date.getTime()) / 1000)
    const minutes = Math.round(seconds / 60)
    const hours = Math.round(minutes / 60)
    const days = Math.round(hours / 24)
    const weeks = Math.round(days / 7)
    const months = Math.round(days / 30.44) // Approximate average month length
    const years = Math.round(days / 365.25) // Approximate year length

    const absSeconds = Math.abs(seconds)
    const absMinutes = Math.abs(minutes)
    const absHours = Math.abs(hours)
    const absDays = Math.abs(days)
    const absWeeks = Math.abs(weeks)
    const absMonths = Math.abs(months)
    const absYears = Math.abs(years)

    const future = seconds < 0
    const prefix = future ? 'in ' : ''
    const suffix = future ? '' : ' ago'

    if (absSeconds < 45) {
      // Increased threshold slightly for "just now"
      return 'just now'
    } else if (absMinutes < 60) {
      return `${prefix}${absMinutes} minute${absMinutes !== 1 ? 's' : ''}${suffix}`
    } else if (absHours < 24) {
      return `${prefix}${absHours} hour${absHours !== 1 ? 's' : ''}${suffix}`
    } else if (absDays < 7) {
      return `${prefix}${absDays} day${absDays !== 1 ? 's' : ''}${suffix}`
    } else if (absWeeks < 5) {
      // Up to roughly a month
      return `${prefix}${absWeeks} week${absWeeks !== 1 ? 's' : ''}${suffix}`
    } else if (absMonths < 12) {
      return `${prefix}${absMonths} month${absMonths !== 1 ? 's' : ''}${suffix}`
    } else {
      return `${prefix}${absYears} year${absYears !== 1 ? 's' : ''}${suffix}`
    }
  }

  /**
   * Creates a Date object representing the start of the day for the given date.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns A Date object set to 00:00:00.000 for that day (in local time), or null if input is invalid.
   */
  static startOfDay(input: Date | string | number): Date | null {
    const date = this._parseInput(input)
    if (!date) return null

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    return start
  }

  /**
   * Creates a Date object representing the end of the day for the given date.
   * @param input - The date value (Date object, string, or timestamp number).
   * @returns A Date object set to 23:59:59.999 for that day (in local time), or null if input is invalid.
   */
  static endOfDay(input: Date | string | number): Date | null {
    const date = this._parseInput(input)
    if (!date) return null

    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return end
  }

  /**
   * Adds a specified number of days to a date.
   * @param input - The date value (Date object, string, or timestamp number).
   * @param daysToAdd - The number of days to add (can be negative).
   * @returns A new Date object with the days added, or null if input is invalid.
   */
  static addDays(input: Date | string | number, daysToAdd: number): Date | null {
    const date = this._parseInput(input)
    if (!date) return null

    const newDate = new Date(date)
    newDate.setDate(date.getDate() + daysToAdd)
    return newDate
  }

  // Add more methods as needed (e.g., addHours, addMonths, differenceInDays, isBefore, isAfter, etc.)
}

// --- Example Usage ---
/* const now = new Date(); // Approx Sun, 30 Mar 2025 16:20:54 GMT+01:00 (Libreville Time)
const pastDateString = "2024-12-25T10:00:00.000Z"; // Christmas 2024 UTC
const futureTimestamp = Date.now() + (5 * 24 * 60 * 60 * 1000); // 5 days from now

console.log("Current Time:", now.toString()); // Show local time string

// ... (previous examples remain valid)

console.log("\n--- LocaleString Formatting (using Intl.DateTimeFormatOptions) ---");
const localeOptions1: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(`Locale Options 1 (en-US):`, DateTimeUtils.formatToLocaleString(now, localeOptions1, 'en-US')); // e.g., Sunday, March 30, 2025
console.log(`Locale Options 1 (fr-FR):`, DateTimeUtils.formatToLocaleString(now, localeOptions1, 'fr-FR')); // e.g., dimanche 30 mars 2025

const localeOptions2: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short' };
console.log(`Locale Options 2 (default locale):`, DateTimeUtils.formatToLocaleString(now, localeOptions2)); // e.g., 4:20:54 PM GMT+1 (depends on locale)
console.log(`Locale Options 2 (es-ES):`, DateTimeUtils.formatToLocaleString(now, localeOptions2, 'es-ES')); // e.g., 4:20:54 p. m. GMT+1

console.log("\n--- Custom String Formatting (using formatByString) ---");
console.log(`Format "YYYY/MM/DD":`, DateTimeUtils.formatByString(now, "YYYY/MM/DD")); // e.g., 2025/03/30
console.log(`Format "DD-MM-YY H:m":`, DateTimeUtils.formatByString(now, "DD-MM-YY H:m")); // e.g., 30-03-25 16:20
console.log(`Format "h:mm:ss a":`, DateTimeUtils.formatByString(now, "h:mm:ss a"));   // e.g., 4:20:54 pm
console.log(`Format "M/D/YYYY HH:mm":`, DateTimeUtils.formatByString(now, "M/D/YYYY HH:mm")); // e.g., 3/30/2025 16:20
console.log(`Format with literals:`, DateTimeUtils.formatByString(now, "Date is DD/MM/YYYY, Time is hh:mm A")); // e.g., Date is 30/03/2025, Time is 04:20 PM

console.log("\n--- Date Manipulation Examples ---");
const startOfToday = DateTimeUtils.startOfDay(now);
console.log("Start of Today:", DateTimeUtils.formatToLocaleString(startOfToday, { dateStyle:'medium', timeStyle: 'medium'})); // Use localeString for better readability
const endOfToday = DateTimeUtils.endOfDay(now);
console.log("End of Today:", DateTimeUtils.formatToLocaleString(endOfToday, { dateStyle:'medium', timeStyle: 'medium'}));
const datePlus5Days = DateTimeUtils.addDays(now, 5);
console.log("Now + 5 Days:", DateTimeUtils.formatToLocaleString(datePlus5Days, { dateStyle:'medium'})); // e.g., Apr 4, 2025 */
