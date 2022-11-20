/* next Module */
import Script from "next/script";
// * react
export default function Component() {
    return (
        <>
            {/* <div className="grid grid-cols-6 gap-6"> 같은 그리드 시스템 필요. 또는 public GridBorderBox와 같이사용*/}
            <div className="col-span-6 sm:col-span-4">
                <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                >
                    Country
                </label>
                <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                </select>
            </div>
        </>
    );
}
