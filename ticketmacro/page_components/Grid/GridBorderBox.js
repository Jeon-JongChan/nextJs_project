/* next Module */
import Script from "next/script";
// * react
/**
 *
 * @param {Object[]} propComponents - 여러개의 컴포넌트를 출력할 때 컴포넌트 배열을 전달 받는다.
 * @param {Array} propComponentsProperty - 여러개의 컴포넌트에 전달할 props. 전달할 데이터가 없어도 반드시 순서대로
 * @param {Function} propComponent - 단일 컴포넌트를 출력할 때 컴포넌트 함수를 전달 받는다.
 * @param {Object} propComponentProperty - 단일 컴포넌트에 전달할 props.
 * @param {Function} propButton - 버튼이 포함되야할 경우 버튼 컴포넌트 전달
 * @param {String} noteHeader - 오른쪽 컴포넌트 설명 제목. h3
 * @param {String} noteContent - 오른쪽 컴포넌트 설명 내용. h3
 */
export default function Component(props) {
    return (
        //<div className="flex flex-col p-2 w-full lg:w-1/2">
        <>
            <div className="grid grid-cols-6 gap-6">
                {props?.noteHeader ? (
                    <div className="col-span-6">
                        <div className="px-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{props.noteHeader}</h3>
                            <p className="mt-1 text-sm text-gray-600">{props.noteContent}</p>
                        </div>
                    </div>
                ) : (
                    ""
                )}

                <div className="mt-5 col-span-6">
                    <div className="grid grid-cols-6 gap-2 shadow sm:overflow-hidden sm:rounded-md">
                        {/* 여러개의 컴포넌트를 받았을 때 실행되는 부분 */}
                        {props.propComponents
                            ? props.propComponents.map((CallComponent, index) => {
                                  //   전달할 props 있는 경우 같이 전달. index도 같이 전달해 child list key error 해결
                                  if (props.propComponentsProperty?.[index]) {
                                      return <CallComponent key={index} {...props.propComponentsProperty[index]}></CallComponent>;
                                  }
                                  return (
                                      //   <div key={index} className="bg-white px-4 py-3">
                                      <CallComponent key={index}></CallComponent>
                                  );
                              })
                            : ""}
                        {/* 단일 컴포넌트 값을 받았을 때 실행되는 부분 */}
                        {props.propComponent ? <props.propComponent {...props.propComponentProperty}></props.propComponent> : ""}
                        {props.propButton ? <props.propButton></props.propButton> : ""}
                    </div>
                </div>
            </div>
        </>
    );
}
