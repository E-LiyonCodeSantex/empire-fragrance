import StickyPageHeader from "@/components/common/pageTitle";

const DealsPage = () =>{
    return(
        <div className="w-full bg-gray-100 min-h-[400px] pt-14 pb-4 px-2 flex flex-col justify-center items-center gap-4">
            <StickyPageHeader title="Top Deals" path="Home > Top Deals"/>
        </div>
    )
}

export default DealsPage;