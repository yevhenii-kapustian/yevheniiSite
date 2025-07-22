import { CalendarCheck, Barbell, ChartLineUp } from "@phosphor-icons/react";
import { babes } from "@/app/fonts";
import { statsContainerStyles,
        statsTitleStyles,
        statsItemsContainer,
        statsItemsWrapper,
        statsItemsIconWrapper,
        statsItemsNumber,
        statsItemsTitle,
        statsItemsSubtitle,
        statsDescriptionStyles
 } from "./styles";

const StatsSection = () => {
    return(
        <section className={statsContainerStyles}>
            <h2 className={`${babes.className} ${statsTitleStyles}`}>A stronger, healthier, and more confident <span>you</span></h2>
            <div className={statsItemsContainer}>
                <div className={statsItemsWrapper}>
                    <div className={statsItemsIconWrapper}>
                        <CalendarCheck size={32} />
                    </div>
                    <h4 className={statsItemsNumber}>92%</h4>
                    <p className={statsItemsTitle}>of clients report more</p>
                    <p className={statsItemsSubtitle}>consistency with exercise*</p>
                </div>
                 <div className={statsItemsWrapper}>
                    <div className={statsItemsIconWrapper}>
                        <Barbell size={32}/>
                    </div>
                    <h4 className={statsItemsNumber}>89%</h4>
                    <p className={statsItemsTitle}>of clients report</p>
                    <p className={statsItemsSubtitle}>increased strength*</p>
                </div>
                 <div className={statsItemsWrapper}>
                    <div className={statsItemsIconWrapper}>
                        <ChartLineUp size={32}/>
                    </div>
                    <h4 className={statsItemsNumber}>73%</h4>
                    <p className={statsItemsTitle}>of clients report</p>
                    <p className={statsItemsSubtitle}>boosted confidence*</p>
                </div>
            </div>
            <h5 className={statsDescriptionStyles}>*survey feedback shows strong approval of Yevhenii's coaching results</h5>
        </section>
    )
}

export default StatsSection