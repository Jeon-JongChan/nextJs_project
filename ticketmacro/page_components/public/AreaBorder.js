/* next Module */
import Script from "next/script";
// * react
/**
 * @param {string} css - css text
 */
export default function Component(props) {
    const cssText = props?.css || "";
    return (
        <>
            <div className={["hidden sm:block", cssText].join(" ")} aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
        </>
    );
}
