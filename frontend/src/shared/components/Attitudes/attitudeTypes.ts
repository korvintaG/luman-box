import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { [key: `data-${string}`]: string; };
export const attitudeOriginalArray = [0, 1, 2, 3, 4]
export const attitudeViewArray = [1, 2, 0, 3, 4];
export const attitudeReverseArray = [2, 0, 1, 3, 4];
export const attitudeLikeArray = [1, 2];
export const attitudeDisLikeArray = [3, 4];
export const attitudeStrongCaseArray = [1, 4];
export const attitudeNotStrongCaseArray = [2, 3];