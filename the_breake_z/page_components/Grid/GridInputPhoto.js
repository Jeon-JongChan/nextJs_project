/* next Module */
import Script from "next/script";
// import { useState } from "react";
// * react
/**
 *
 * @param {label} [label] - 상단 라벨에 들어갈 텍스트
 * @param {label} [id] - input에 들어갈 id
 * @returns
 */
export default function Component(props) {
    // const [uploadImage, setUploadImage] = useState("");
    let label = props?.label || "Cover photo";
    let inputId = props?.id || "file-input";
    // let colSpenValue = props?.colSpan || 6;
    // let colSmSpenValue = props?.colSmSpan || 4;
    function updateUploadFileName(e) {
        console.log(e.target.value, e.target.files);
        let file = e.target.files[0];
        let nodeInput = e.target;
        // input - label - div - div - div - div
        let nodeRoot = nodeInput.parentNode.parentNode.parentNode.parentNode.parentNode;
        let nodeChangeLabel = nodeRoot.querySelector(".gridinputphoto-name");
        let nodeChangeDiv = nodeRoot.querySelector(".gridinputphoto-frame");

        // setUploadImage(URL.createObjectURL(file));
        let imageUrl = URL.createObjectURL(file);
        nodeChangeDiv.style.backgroundImage = "url('" + imageUrl + "')";
        nodeChangeLabel.innerText = file.name;
    }

    return (
        <>
            {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
            <div className="space-y-6 bg-white px-2 py-3">
                <label className="block text-sm font-medium text-gray-700">
                    {label}&nbsp;&nbsp;
                    <span className="text-xs text-gray-400">파일 정보 :&nbsp;</span>
                    <span className="gridinputphoto-name text-xs text-gray-400"></span>
                </label>
                <div className="gridinputphoto-frame mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    {/* <img src={uploadImage}></img> */}
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor={inputId}
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input id={inputId} name={inputId} onChange={(e) => updateUploadFileName(e)} type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
        </>
    );
}
