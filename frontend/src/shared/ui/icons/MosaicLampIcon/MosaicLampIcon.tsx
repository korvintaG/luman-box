import React from "react";

interface MosaicLampProps extends React.SVGProps<SVGSVGElement> {
  // Дополнительные пропсы, если нужно
  customProp?: string;
}

// 
export const MosaicLampIcon: React.FC<MosaicLampProps> = ({ customProp, ...props }) => (
  <svg
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 511.87 511.87"
    viewBox="0 0 511.87 511.87"
    stroke="currentColor"
    fill="currentColor"
    {...props}
  >
<g
     id="g2"
     transform="matrix(1,0,0,-1,1.7482422e-6,511.87016)">
    <path
       d="M 298.079,3.172 285.93,5.524 V 89.87 h 15 c 8.271,0 15,6.729 15,15 0,8.271 -6.729,15 -15,15 h -15 v 90 h 90 v -15 c 0,-8.271 6.729,-15 15,-15 8.271,0 15,6.729 15,15 v 15 h 83.973 c 1.426,-8.177 6.027,-24.302 6.027,-45 C 495.93,61.952 402.462,-17.035 298.079,3.172 Z M 464.956,179.87 h -31.597 c -6.19,-17.461 -22.873,-30 -42.43,-30 -19.557,0 -36.239,12.539 -42.43,30 h -32.57 V 147.3 c 17.461,-6.191 30,-22.873 30,-42.43 0,-19.557 -12.539,-36.239 -30,-42.43 V 30.812 c 81.052,-8.525 150,54.112 150,134.058 0.001,4.822 -0.321,9.79 -0.973,15 z"
       id="path1" />
    <path
       d="m 240.929,209.87 c -19.556,0 -36.239,12.539 -42.43,30 h -32.57 V 207.3 c 17.461,-6.191 30,-22.873 30,-42.43 0,-19.557 -12.539,-36.239 -30,-42.43 V 59.714 c -27.79,5.22 -18.45,3.445 -20.408,3.855 C 80.767,77.09 29.695,130.212 18.435,195.756 7.422,259.847 33.377,322.695 86.169,359.772 c 12.003,8.432 19.76,22.999 19.76,37.111 V 511.87 h 150 V 398.815 c 0,-15.159 8.122,-30.743 20.692,-39.701 34.005,-24.235 57.349,-60.19 65.732,-101.242 l 3.677,-18.001 h -62.672 c -6.19,-17.462 -22.873,-30.001 -42.429,-30.001 z m -105,272 v -30 h 30 v -30 h -30 v -24.987 c 0,-1.674 -0.067,-3.346 -0.188,-5.013 h 90.516 c -0.217,2.307 -0.328,4.625 -0.328,6.945 v 23.055 h -30 v 30 h 30 v 30 z M 259.21,334.683 c -9.948,7.09 -18.062,16.518 -23.792,27.187 H 126.927 C 121.315,351.41 113.288,342.159 103.413,335.223 60.205,304.878 38.974,253.384 48.002,200.836 56.261,152.762 90.721,112.879 135.93,97.274 v 52.596 h 15 c 8.271,0 15,6.729 15,15 0,8.271 -6.729,15 -15,15 h -15 v 90 h 90 v -15 c 0,-8.271 6.729,-15 15,-15 8.271,0 15,6.729 15,15 v 15 h 52.053 c -9.167,26.038 -26.064,48.628 -48.773,64.813 z"
       id="path2" />
  </g>
    </svg>
);

export default MosaicLampIcon;
