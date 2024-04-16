import RatingPanel from "./components/RatingPanel";
import TierList from "./components/TierList";
import UnratedBox from "./components/UnratedBox";
import styles from "@/app/page.module.css"

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.midblock}>
    <TierList></TierList>
    <RatingPanel></RatingPanel>
    </div>
    <UnratedBox></UnratedBox>
    </div>
  );
}
