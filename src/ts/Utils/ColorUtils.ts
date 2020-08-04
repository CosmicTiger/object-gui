import { IRgb, IRgba, IHsla, IHsl } from "../Interfaces";

export class ColorUtils {
    /**
     * Converts hexadecimal string (HTML color code) in a [[IRgb]] object
     * @param input the hexadecimal string (#f70 or #ff7700)
     */
    public static stringToRgb(input: string): IRgb | undefined {
        return ColorUtils.stringToRgba(input);
    }

    public static hslaToRgba(hsla: IHsla): IRgba {
        const rgbResult = ColorUtils.hslToRgb(hsla);

        return {
            a: hsla.a,
            b: rgbResult.b,
            g: rgbResult.g,
            r: rgbResult.r,
        };
    }

    /**
     * Converts a Hue Saturation Lightness ([[IHsl]]) object in a [[IRgb]] object
     * @param hsl
     */
    public static hslToRgb(hsl: IHsl): IRgb {
        const result: IRgb = { b: 0, g: 0, r: 0 };
        const hslPercent: IHsl = {
            h: hsl.h / 360,
            l: hsl.l / 100,
            s: hsl.s / 100,
        };

        if (hslPercent.s === 0) {
            result.b = hslPercent.l; // achromatic
            result.g = hslPercent.l;
            result.r = hslPercent.l;
        } else {
            const q =
                hslPercent.l < 0.5
                    ? hslPercent.l * (1 + hslPercent.s)
                    : hslPercent.l + hslPercent.s - hslPercent.l * hslPercent.s;
            const p = 2 * hslPercent.l - q;

            result.r = ColorUtils.hue2rgb(p, q, hslPercent.h + 1 / 3);
            result.g = ColorUtils.hue2rgb(p, q, hslPercent.h);
            result.b = ColorUtils.hue2rgb(p, q, hslPercent.h - 1 / 3);
        }

        result.r = Math.floor(result.r * 255);
        result.g = Math.floor(result.g * 255);
        result.b = Math.floor(result.b * 255);

        return result;
    }

    private static stringToRgba(input: string): IRgba | undefined {
        if (input.startsWith("rgb")) {
            const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([\d.]+)\s*)?\)/i;
            const result = regex.exec(input);

            return result
                ? {
                      a: result.length > 4 ? parseFloat(result[5]) : 1,
                      b: parseInt(result[3], 10),
                      g: parseInt(result[2], 10),
                      r: parseInt(result[1], 10),
                  }
                : undefined;
        } else if (input.startsWith("hsl")) {
            const regex = /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([\d.]+)\s*)?\)/i;
            const result = regex.exec(input);

            return result
                ? ColorUtils.hslaToRgba({
                      a: result.length > 4 ? parseFloat(result[5]) : 1,
                      h: parseInt(result[1], 10),
                      l: parseInt(result[3], 10),
                      s: parseInt(result[2], 10),
                  })
                : undefined;
        } else {
            // By Tim Down - http://stackoverflow.com/a/5624139/3493650
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
            const hexFixed = input.replace(shorthandRegex, (_m, r, g, b, a) => {
                return r + r + g + g + b + b + (a !== undefined ? a + a : "");
            });
            const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
            const result = regex.exec(hexFixed);

            return result
                ? {
                      a: result[4] !== undefined ? parseInt(result[4], 16) / 0xff : 1,
                      b: parseInt(result[3], 16),
                      g: parseInt(result[2], 16),
                      r: parseInt(result[1], 16),
                  }
                : undefined;
        }
    }

    /**
     *
     * @param p
     * @param q
     * @param t
     */
    private static hue2rgb(p: number, q: number, t: number): number {
        let tCalc = t;

        if (tCalc < 0) {
            tCalc += 1;
        }

        if (tCalc > 1) {
            tCalc -= 1;
        }

        if (tCalc < 1 / 6) {
            return p + (q - p) * 6 * tCalc;
        }

        if (tCalc < 1 / 2) {
            return q;
        }

        if (tCalc < 2 / 3) {
            return p + (q - p) * (2 / 3 - tCalc) * 6;
        }

        return p;
    }
}
