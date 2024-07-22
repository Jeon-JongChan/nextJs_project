/* next Module */
import Script from "next/script";
import Image from "next/image";
// * react
/**
 * 클릭가능한 버튼으로 이루어진 리스트.
 * @param {Object[]} items - list item(text, func:function) 객체의 배열
 */
export default function Component(props) {
    let items = props?.items || null;
    return (
        <>
            <div className="w-full h-full rounded-md bg-white shadow" role="list" aria-orientation="vertical">
                <div className="py-1" role="none">
                    {items
                        ? items.map((item, idx) => (
                              <button key={idx} onClick={item.func || null} className="text-gray-700 text-center block px-2 py-2 text-sm hover:bg-gray-50 w-full" role="listitem">
                                  {item.text}
                              </button>
                          ))
                        : ""}
                </div>
            </div>
        </>
    );
}
