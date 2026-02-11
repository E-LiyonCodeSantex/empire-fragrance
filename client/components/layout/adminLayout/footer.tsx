

const AdminFooter = () =>{
    return(
        <div>
            <div className="w-full bg-gray-800 text-white flex flex-col justify-center items-center px-4 gap-4 py-6">
                <h1 className="font-bold text-lg">Empire Fragrance</h1>
                <p className="text-sm text-center">© 2024 Cartel Empire. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a>
                </div>
            </div>
        </div>
    )
}


export default AdminFooter;