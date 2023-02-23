import GridInputText from "/page_components/Grid/GridInputText";
import GridBorderBox from "/page_components/Grid/GridBorderBox";

export default function Home() {
    return (
        <>
            <div className="flex flex-col w-1/2 p-2">
                <GridBorderBox
                    noteHeader={"매크로 입력 데이터"}
                    propComponents={[GridInputText, GridInputText, GridInputText]}
                    propComponentsProperty={[{label: "티켓팅 주소"}, {label: "일반데이터"}]}
                ></GridBorderBox>
            </div>
            <div className="mt-5 md:col-span-8 md:mt-0 w-1/2">
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="py-2 px-2">
                        <GridInputText label={"티켓팅 주소"}></GridInputText>
                    </div>
                    <div className="py-2 px-2">
                        <GridInputText></GridInputText>
                    </div>
                    <div className="py-2 px-2">
                        <GridInputText></GridInputText>
                    </div>
                </div>
            </div>
        </>
    );
}
