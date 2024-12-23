//SVG 파일 인식 가능
declare module "*.svg" {
    import React from "react";
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string; // 기본 SVG 파일 경로도 지원
    export default src;
}