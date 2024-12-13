import Link from "next/link";
import Image from "next/image";

export default function Component({maindata}) {
  // maindata를 id로 매핑된 객체로 변환
  const dataMap = maindata.reduce((acc, item) => {
    acc[item.id] = item.value;
    return acc;
  }, {});

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-2 gap-48">
        {/* Patrol Link */}
        <div className={`flex flex-col items-center justify-center w-full max-w-md mx-auto ${dataMap?.["battle_active_status_patrol"] === "X" ? "opacity-70 pointer-events-none" : ""}`}>
          <Link id="battle_active_status_patrol" href={dataMap["battle_active_status_patrol"] === "X" ? "#" : "/battle/patrol"} className="mt-10">
            <Image src="/images/patrol/05_patrol_enter_button.png" alt="Patrol Button" className="mb-4" width={298} height={306} />
          </Link>
        </div>

        {/* Raid Link */}
        <div className={`flex flex-col items-center justify-center w-full max-w-md mx-auto ${dataMap?.["battle_active_status_raid"] === "X" ? "opacity-70 pointer-events-none" : ""}`}>
          <Link id="battle_active_status_raid" href={dataMap["battle_active_status_raid"] === "X" ? "#" : "/battle/lobby"}>
            <Image src="/images/patrol/05_raid_enter_button.png" alt="Raid Button" className="mb-4" width={262} height={362} />
          </Link>
        </div>
      </div>
    </div>
  );
}
