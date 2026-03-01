import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/app_logo.png" alt="Application Logo" {...props} />;
}
