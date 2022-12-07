// @ts-check
import React, { useState, useEffect } from "react";
import TopNavBar from "./components/Navigations/TopNavBar";
import GlobalSideBar from "./components/Navigations/GlobalSideBar";
import { getMonth } from "./util";
import CalendarHeader from "./components/Content/CalendarParts/CalendarHeader";
import Month from "./components/Content/Month";
import { useNavigate } from "react-router-dom";
import { auth, db, firestore, functions } from "./firebase";
import UsersSettings from "./components/Navigations/UsersSettings";
import Notifications from "./components/Navigations/Notifications";
import UserSettings from "./components/Navigations/UserSettings";
import SettingsTab from "./components/Navigations/SettingsTab";
import dayjs from "dayjs";
import LoadingScreen from "./components/AwaitComponents/LoadingScreen";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"
import { calcSubscription, createCheckoutSession } from "./components/StripeComponents/StripeCustomFunctions";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { onValue, ref } from "firebase/database";
import { ROLES } from "./components/SignIn";

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const PUBLIC_KEY = "pk_test_51LvIkhFlIMqx6x2711SpIi218jZPjopxmA7Gr4WoexWk5TGkipcEFkUp5cEifIBt5dFhIrcI9xpEws2vje2di0LM00tgt9W5pB"

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export const CalendarContext = React.createContext();

export default function Home() {
    const [year, setYear] = useState(dayjs().year());
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [currentCalendar, setCurrentCalendar] = useState(getMonth(year, new Date().getMonth()))
    const [tab, setTab] = useState(0);
    const [users, setUsers] = React.useState(new Array());
    const [currUser, setCurrUser] = React.useState(new Array());
    const [currUserPhoto, setCurrUserPhoto] = React.useState(null);
    const [roomUsers, setRoomUsers] = React.useState(new Array());
    const [darkTheme, setDarkTheme] = React.useState(false)
    const [defaultNumVacations, setDefaultNumVacations] = React.useState(0)
    const [countryAttribute, setCountryAttribute] = React.useState(null)
    const [savedEvents, setSavedEvents] = React.useState(new Array());
    const [unconfirmedEvents, setUnconfirmedEvents] = React.useState(new Array()); 
    const [downloaded, setDownloaded] = React.useState(false);
    const [nationHolidays, setNationHolidays] = React.useState(new Array()); 
    const [invites, setInvites] = React.useState(new Array())
    const [vacations, setVacations] = React.useState(new Array())
    const [notificationNumber, setNotificationNumber] = React.useState(0)
    const [isRoomActive, setIsRoomActive] = React.useState(false)
    const [prem, setPrem] = React.useState(false)

    useEffect(() => {
        setCurrentCalendar(getMonth(year, monthIndex));
    }, [monthIndex]);

    const navigate = useNavigate();

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) navigate("/")
            else if (!user) navigate("/auth")
        })
    }, [])

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user && currUser.uuid) {
                onSnapshot(doc(firestore, "customers", `${currUser.room}`), (snap) => {
                    const leadId = snap.data().stripeId
                    const getList = httpsCallable(functions, "getSubscriptions");
                    
                    getList({customerId: leadId})
                    .then(res => setPrem(res.data.data[0].plan.active))
                    .catch(e => console.log(e, "no sub"))
                })
            }
        })
    }, [currUser])

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            onValue(ref(db, `/users`), (snapshot) => {
                let sArray = new Array();
                const data = snapshot.val();
                if(data !== null)
                {
                    Object.values(data).map((_user) => {
                        if(user.uid === _user.uuid)
                        {
                            setCurrUser({
                                firstName: _user.firstName,
                                lastName: _user.lastName,
                                vacationsNum: _user.vacationsNum, 
                                unpaidVacationDays: _user.unpaidVacationDays,
                                sickLeaves: _user.sickLeaves,
                                role: _user.role,
                                email: _user.email,
                                room: _user.room,
                                uuid:_user.uuid
                            })
                        }
                    })
                }
                else console.log("Can't find user")
            })
        })
    }, [])
    
    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            let arr = new Array()
            users.find((_user) => {
              onValue(ref(db, `/rooms/${_user.uuid}/pending/emailArray`), (snapshot) => {
                const data = snapshot.val();
                if(data !== null)
                {
                  Object.values(data).map((val) => {
                    if(val === currUser.email)
                    {
                      arr = [...arr, _user.uuid]
                    }
                  })
                  setInvites(arr);
                }
              })
            });
            if(currUser.role === ROLES.ADMIN || currUser.role === ROLES.HRMANAGER) {
                onValue(ref(db, `/rooms/${currUser.room}/events/pending`), (snapshot) => {
                const data = snapshot.val();
                let arr = new Array()
                if(data !== null)
                {
                    Object.values(data).map((val) => {
                    arr = [...arr, val]
                    })
                    setVacations(arr)
                }
                })
            }

            onValue(ref(db, `rooms/${currUser.room}/settings/`), (snapshot) => {
                const data = snapshot.val()
                if(data !== null)
                {
                    setIsRoomActive(data.isRoomActive)
                }
            })
          }
        });
        if(currUser && vacations) 
        setTimeout(() => {
            setDownloaded(true) 
        }, 1000)
        else console.log()
    }, [currUser]);

    React.useEffect(() => {
        if(invites && vacations) setNotificationNumber(invites.length + vacations.length)
    }, [invites, vacations])

    return (
        <React.Fragment>
            <CalendarContext.Provider value={{  
                                                currentCalendar, setCurrentCalendar, 
                                                tab, setTab, 
                                                users, setUsers,
                                                invites, setInvites,
                                                currUser, setCurrUser, 
                                                vacations, setVacations,
                                                roomUsers, setRoomUsers,
                                                darkTheme, setDarkTheme,
                                                downloaded, setDownloaded,
                                                savedEvents, setSavedEvents,
                                                isRoomActive, setIsRoomActive,
                                                currUserPhoto, setCurrUserPhoto,
                                                nationHolidays, setNationHolidays,
                                                countryAttribute, setCountryAttribute,
                                                unconfirmedEvents, setUnconfirmedEvents,
                                                notificationNumber, setNotificationNumber,
                                                downloaded, setDownloaded,
                                                defaultNumVacations, setDefaultNumVacations,
                                                year, setYear,
                                                monthIndex, setMonthIndex,
                                                }}>
                    <TopNavBar />
                    <div className="h-max--48 flex flex-1">
                        <GlobalSideBar />
                        { tab  === 0 ?
                            isRoomActive === true ? 
                                <div className="flex flex-1 flex-col">
                                    <CalendarHeader month={monthIndex}/>
                                    <Month month={currentCalendar} />
                                    <Elements stripe={stripeTestPromise}>
                                        { 
                                        !prem ? 
                                        <div className="w-56 h-10 ml-44 mt-10 bg-yellow-400 flex justify-center items-center rounded-xl font-semibold active:shadow-xl">
                                            <button onClick={() => {
                                                                    setDownloaded(false)
                                                                    createCheckoutSession(currUser.uuid, currUser)
                                                                    .catch(e => {
                                                                        setDownloaded(true)
                                                                        console.log(e)
                                                                    })
                                                                    
                                                                    }}>
                                                Upgrade to premium!
                                            </button>
                                        </div>
                                        : 
                                        <React.Fragment>
                                            <div className="text-3xl font-semibold ml-44 mt-10">Test buttons for group Admin!!!</div>
                                            <div className="w-56 h-10 ml-44 mt-10 bg-blue-400 flex justify-center items-center rounded-xl font-semibold active:shadow-xl">
                                                <button onClick={() => setDownloaded(false)}>
                                                    <a href="https://billing.stripe.com/p/login/test_bIYg197rkeYL61a6oo">Manage Subsription!</a>
                                                </button>
                                            </div>
                                            <div className="w-56 h-10 ml-44 mt-10 bg-orange-400 flex justify-center items-center rounded-xl font-semibold active:shadow-xl">
                                                <button onClick={() => calcSubscription(currUser)}>
                                                    Recount Subsciption
                                                </button>
                                            </div>
                                            <div className="w-56 h-10 ml-44 mt-10 bg-green-400 flex justify-center items-center rounded-xl font-semibold active:shadow-xl">
                                                <button onClick={() => calcSubscription(currUser, false, true).then(res => console.log(res)).catch(e => console.log(e))}>
                                                    Cancel Subsciption
                                                </button>
                                            </div>
                                        </React.Fragment>
                                        }
                                    </Elements>
                                </div>
                            : isRoomActive === false ? 
                                <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                                    <div className="w-120 h-96 rounded-md p-2 bg-white">
                                        <div className="font-semibold text-center text-3xl mb-10">The leader of this group leaved</div>
                                        <div className="font-semibold text-lg mb-6">You can go into Notifications tab to:</div>
                                        <div className="font-semibold text-lg">• accept someone invite</div>
                                        <div className="font-semibold text-lg">• leave to your own group</div>
                                        <div className="w-full h-2/5 flex justify-center items-center">
                                            <FontAwesomeIcon onClick={()=>setTab(3)} className={"w-15 h-20 pr-2 pl-3 hover:text-main-gray"} icon={faEnvelope} />
                                        </div>
                                    </div>
                                </div>
                            : ""
                        : tab === 1 ?
                            <UsersSettings />
                        : tab === 2 ?
                            <UserSettings />
                        : tab === 3 ?
                            <Notifications tab={tab}/>
                        : tab === 4 ?
                            <SettingsTab />
                        : ""
                        }
                    </div>
                    {downloaded ? "" : <LoadingScreen/>}
            </CalendarContext.Provider>
        </React.Fragment>
    )
}