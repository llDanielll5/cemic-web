import * as React from "react";
import { SVGProps } from "react";
const PolygonLanding = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={300} height={500} {...props}>
    <path
      d="M70 500 90 1H1v499z"
      style={{
        fill: "#fff",
        stroke: "#fff",
        strokeWidth: 5,
        fillRule: "evenodd",
      }}
    />
  </svg>
);
export default PolygonLanding;
