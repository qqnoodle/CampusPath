/**
 * Map image registry
 *
 * React Native's bundler requires static require() calls — you cannot build
 * a dynamic string and pass it to require() at runtime. The solution is to
 * pre-register every floor map here, keyed by "BUILDING_FLOOR" (uppercase),
 * which matches the guaranteed filename pattern BUILDINGNAME_FLOOR.jpg.
 *
 * HOW TO ADD A NEW FLOOR MAP:
 *   1. Drop the image into assets/maps/  (e.g. SCIS1_1.jpg)
 *   2. Add one line below:
 *        SCIS1_1: require('../assets/maps/SCIS1_1.jpg'),
 *
 * The key must be:  `${BUILDING}_${FLOOR}`  — both uppercase, underscore separator.
 * Floor numbers should match exactly what your node IDs use (e.g. "1", "2", "B1").
 */

import { ImageSourcePropType } from 'react-native';

const MAP_IMAGES: Record<string, ImageSourcePropType> = {
    // Add your floor maps here 
    COM1_B1: require('../images/COM1_B1.jpg'),
    COM1_1: require('../images/COM1_1.jpg'),
    COM1_2: require('../images/COM1_2.jpg'),
    COM1_3: require('../images/COM1_3.jpg'),
    COM2_B1: require('../images/COM2_B1.jpg'),
    COM2_1: require('../images/COM2_1.jpg'),
    COM2_2: require('../images/COM2_2.jpg'),
    COM2_3: require('../images/COM2_3.jpg'),
    COM2_4: require('../images/COM2_4.jpg'),
    COM3_B1: require('../images/COM3_B1.jpg'),
    COM3_1: require('../images/COM3_1.jpg'),
    COM3_2: require('../images/COM3_2.jpg'),
    COM4_2: require('../images/COM4_2.jpg'),
    COM4_3: require('../images/COM4_3.jpg'),
    COM4_4: require('../images/COM4_4.jpg'),
    COM4_5: require('../images/COM4_5.jpg'),

};

/**
 * Look up the map image for a given building + floor.
 *
 * @param building  Building name as it appears in node IDs (e.g. "SCIS1")
 * @param floor     Floor as a number or string (e.g. 1 or "B1")
 * @returns         ImageSourcePropType ready to pass to <Image source={...} />
 *                  or null if no image is registered for that building/floor.
 */
export function getMapImage(
    building: string,
    floor: number | string
): ImageSourcePropType | null {
    const key = `${building.toUpperCase()}_${floor}`;
    return MAP_IMAGES[key] ?? null;
}
