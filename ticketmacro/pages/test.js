import Link from "next/link";

export default function Test() {
    async function callApi(method) {
        await fetch("api/crawler/" + method);
    }
    return (
        <>
            <div>Test SIte</div>
            <div>
                <button
                    onClick={() => {
                        callApi("dbinit");
                    }}
                >
                    dbinit
                </button>
            </div>
            <div>
                <button
                    onClick={() => {
                        callApi("tableTest");
                    }}
                >
                    tableTest
                </button>
            </div>
            <div>
                <button
                    onClick={() => {
                        callApi("get");
                    }}
                >
                    site get
                </button>
            </div>
            <style jsx>{`
                button {
                    width: 100px;
                    height: 20px;
                }
            `}</style>
        </>
    );
}
