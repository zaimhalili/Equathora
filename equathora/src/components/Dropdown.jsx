import React from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ label, items }) => {
    return (
        <div className='relative flex h-[84px] ml-10 lg:ml-5 z-[1001] group'>
            <button className='bg-transparent text-[var(--secondary-color)] border-none font-[Public_Sans,sans-serif] h-full my-auto w-auto list-none font-semibold text-lg px-3 lg:px-2 hover:text-[var(--accent-color)] transition-colors duration-200'>
                {typeof label === 'string' ? label : React.cloneElement(label, {
                    className: 'text-[var(--secondary-color)] transition-colors duration-200 group-hover:text-[var(--accent-color)]'
                })}
            </button>
            <div className="opacity-0 invisible absolute left-[-60px] top-[65px] bg-[var(--main-color)] min-w-[360px] lg:min-w-[320px] shadow-[0_10px_12px_rgba(0,0,0,0.2)] font-[Public_Sans,sans-serif] rounded-[5px_5px_10px_10px] z-[1002] transition-all duration-200 group-hover:translate-y-2 group-hover:opacity-100 group-hover:visible">
                {items.map((item, i) =>
                    item.isButton ? (
                        <button
                            key={i}
                            onClick={item.onClick}
                            className='flex w-full p-2.5 gap-2.5 border-t border-[var(--french-gray)] items-center hover:bg-white hover:rounded-[5px_5px_10px_10px] text-[var(--secondary-color)] text-left border-none bg-transparent cursor-pointer'
                        >
                            <img
                                src={item.image}
                                alt={item.text}
                                className='h-[50px] w-[50px]'
                            />
                            <div className="flex flex-col justify-center font-[Public_Sans,serif]">
                                <h4 className='text-[1.1rem] font-semibold'>{item.text}</h4>
                                <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                            </div>
                        </button>
                    ) : (
                        <Link key={i} to={item.to} state={item.state} className='flex w-full p-2.5 gap-2.5 border-t border-[var(--french-gray)] items-center hover:bg-white hover:rounded-[5px_5px_10px_10px] text-[var(--secondary-color)] no-underline'>
                            <img
                                src={item.image}
                                alt={item.text}
                                className='h-[50px] w-[50px]'
                            />
                            <div className="flex flex-col justify-center font-[Public_Sans,serif]">
                                <h4 className='text-[1.1rem] font-semibold'>{item.text}</h4>
                                <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                            </div>
                            {item.notificationsNo && (
                                <div className="ml-auto flex items-center px-2.5">
                                    <h4 className='text-yellow-500 flex h-full items-center font-semibold'>
                                        {item.notificationsNo}
                                    </h4>
                                </div>
                            )}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default Dropdown;