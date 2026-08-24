const AdminTitle = ({ text1, text2 }) => {
    return (
        <h1 className='font-extrabold text-2xl text-slate-800 tracking-tight'>
            {text1} <span className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] bg-clip-text text-transparent">{text2}</span>
        </h1>
    );
};

export default AdminTitle;