/* next Module */
import Script from "next/script";
// * react
/**
 *
 * @param {Object[]} propComponents - 여러개의 컴포넌트를 출력할 때 컴포넌트 배열을 전달 받는다.
 * @param {Array} propCompenetsProperty - 여러개의 컴포넌트에 전달할 props. 전달할 데이터가 없어도 반드시 순서대로
 * @param {Function} propComponent - 단일 컴포넌트를 출력할 때 컴포넌트 함수를 전달 받는다.
 * @param {Object} propCompenetProperty - 단일 컴포넌트에 전달할 props.
 * @param {Function} propButton - 버튼이 포함되야할 경우 버튼 컴포넌트 전달
 */
export default function Component(props) {
    return (
        <>
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        {props.propComponents
                            ? props.propComponents.map((Component, index) => {
                                  console.log("컴포넌트 실행", props);
                                  if (props?.propCompenetsProperty?.[index]) {
                                      console.log(props.propComponentsProperty[index]);
                                      return Component(props.propComponentsProperty[index]);
                                  }
                                  return Component();
                              })
                            : ""}
                        {props.propComponent ? props.propComponent() : ""}
                        {props.propButton ? props.propButton() : ""}
                    </div>
                </div>
            </div>
        </>
    );
}
