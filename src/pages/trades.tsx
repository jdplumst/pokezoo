import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { z } from "zod";
import { ZodTime } from "@/types/zod";

export default function Trades() {
  const router = useRouter();

  const {
    data: session,
    status,
    update: updateSession
  } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    }
  });

  const utils = trpc.useUtils();

  const { data: tradeData, isLoading: tradeLoading } =
    trpc.trade.getTrades.useQuery();

  const { data: instanceData, isLoading: instanceLoading } =
    trpc.instance.getInstanceSpecies.useQuery();

  const initiateMutation = trpc.trade.initiateTrade.useMutation();
  const [initiateModal, setInitiateModal] = useState(false);
  const [description, setDescription] = useState("");

  const offerMutation = trpc.trade.offerTrade.useMutation();
  const [offerModal, setOfferModal] = useState(false);

  const cancelMutation = trpc.trade.cancelTrade.useMutation();
  const withdrawMutation = trpc.trade.withdrawTrade.useMutation();

  const acceptMutation = trpc.trade.acceptTrade.useMutation();
  const rejectMutation = trpc.trade.rejectTrade.useMutation();

  const [tradeId, setTradeId] = useState("-1");

  const [time, setTime] = useState<z.infer<typeof ZodTime>>("night");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // Set time and user data
  useEffect(() => {
    if (status !== "authenticated") return;
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 6 && hour <= 17) {
      setTime("day");
    } else {
      setTime("night");
    }
    setLoading(false);
  }, [session]);

  if (!session || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Trades</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* Main Trading Screen */}
      <div
        className={`min-h-screen ${time} bg-gradient-to-r from-bg-left to-bg-right text-color-text`}>
        <Sidebar page="Trades">
          <Topbar user={session.user} />
          <main className="p-4">
            {session.user.admin && (
              <div className="flex justify-center bg-red-500">
                <button
                  onClick={() => setTime(time === "day" ? "night" : "day")}
                  className="w-fit rounded-lg border-2 border-black bg-purple-btn-unfocus p-2 font-bold hover:bg-purple-btn-focus">
                  Toggle day/night
                </button>
              </div>
            )}
            <button
              onClick={() => setInitiateModal(true)}
              disabled={initiateModal}
              className={`w-48 rounded-lg border-2 border-black p-2 font-bold ${
                time === `day`
                  ? `bg-yellow-btn-unfocus hover:bg-yellow-btn-focus`
                  : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
              }`}>
              Add Trade
            </button>
            {tradeLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="trades grid justify-center gap-10 pt-5">
                {tradeData?.trades.map((t) => (
                  <div className="h-76 w-[600px] border-2 border-solid border-black bg-rose-600 p-2">
                    <div className="flex h-full w-full justify-between">
                      <div className="flex w-1/2 flex-col items-center justify-between gap-5">
                        <div className="h-8 text-center text-xl font-bold">
                          {t.initiator.username} wants to trade!
                        </div>
                        <div
                          className={`h-48 border-2 border-solid border-black p-2 ${
                            t.initiatorInstance.species.rarity === `Common`
                              ? `bg-common-unfocus`
                              : t.initiatorInstance.species.rarity === `Rare`
                              ? `bg-rare-unfocus`
                              : t.initiatorInstance.species.rarity === `Epic`
                              ? `bg-epic-unfocus`
                              : `bg-legendary-unfocus`
                          }`}>
                          <img
                            src={t.initiatorInstance.species.img}
                            width={150}
                            height={150}></img>
                          <div className="text-center font-bold capitalize">
                            {t.initiatorInstance.species.name}
                            {t.initiatorInstance.species.shiny && `⭐`}
                          </div>
                        </div>
                        <div className="h-8 text-xl">{t.description}</div>
                        {t.initiatorId === session.user.id ? (
                          <button
                            onClick={() =>
                              cancelMutation.mutate(
                                { tradeId: t.id },
                                {
                                  onSuccess(data, variables, context) {
                                    utils.trade.getTrades.invalidate();
                                  }
                                }
                              )
                            }
                            disabled={cancelMutation.isLoading}
                            className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                            Cancel
                          </button>
                        ) : (
                          <div className="h-11"></div>
                        )}
                      </div>
                      <div className="h-full w-[1px] border-2 border-solid border-black"></div>
                      {t.offerer && t.offererInstance ? (
                        <div className="flex w-1/2 flex-col items-center justify-between gap-5">
                          <div className="h-8 text-center text-xl font-bold">
                            {t.offerer.username} has an offer!
                          </div>
                          <div
                            className={`h-48 border-2 border-solid border-black p-2 ${
                              t.offererInstance.species.rarity === `Common`
                                ? `bg-common-unfocus`
                                : t.offererInstance.species.rarity === `Rare`
                                ? `bg-rare-unfocus`
                                : t.offererInstance.species.rarity === `Epic`
                                ? `bg-epic-unfocus`
                                : `bg-legendary-unfocus`
                            }`}>
                            <img
                              src={t.offererInstance.species.img}
                              width={150}
                              height={150}></img>
                            <div className="text-center font-bold capitalize">
                              {t.offererInstance.species.name}
                              {t.offererInstance.species.shiny && `⭐`}
                            </div>
                          </div>
                          <div className="h-8"></div>
                          {t.offererId === session.user.id ? (
                            <button
                              onClick={() =>
                                withdrawMutation.mutate(
                                  { tradeId: t.id },
                                  {
                                    onSuccess(data, variables, context) {
                                      utils.trade.getTrades.invalidate();
                                    }
                                  }
                                )
                              }
                              disabled={withdrawMutation.isLoading}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus">
                              Withdraw
                            </button>
                          ) : t.offererId &&
                            t.initiatorId === session.user.id ? (
                            <div className="flex gap-5">
                              <button
                                onClick={() =>
                                  acceptMutation.mutate(
                                    { tradeId: t.id },
                                    {
                                      onSuccess(data, variables, context) {
                                        utils.trade.getTrades.invalidate();
                                        updateSession();
                                      }
                                    }
                                  )
                                }
                                disabled={acceptMutation.isLoading}
                                className="w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus">
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  rejectMutation.mutate(
                                    { tradeId: t.id },
                                    {
                                      onSuccess(data, variables, context) {
                                        utils.trade.getTrades.invalidate();
                                      }
                                    }
                                  )
                                }
                                disabled={rejectMutation.isLoading}
                                className="w-24 rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus">
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="h-11"></div>
                          )}
                        </div>
                      ) : (
                        <div className="flex w-1/2 flex-col items-center justify-between gap-5">
                          <div className="h-7"></div>
                          <div className="flex h-48 items-center p-2 text-center text-xl font-bold">
                            <div>This trade currently has no offers!</div>
                          </div>
                          <button
                            onClick={() => {
                              setOfferModal(true);
                              setTradeId(t.id);
                            }}
                            disabled={offerModal}
                            className="w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus">
                            Add Offer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </Sidebar>

        {/* Modal for Selecting Pokemon */}
        {(initiateModal || offerModal) && (
          <Modal size="Large">
            <button
              onClick={() => {
                setInitiateModal(false);
                setOfferModal(false);
                setError(null);
                setDescription("");
                setTradeId("-1");
              }}
              className="absolute right-4 top-4 text-3xl font-bold">
              X
            </button>
            <div className="p-2 text-3xl font-bold">Select a Pokémon</div>
            {initiateModal && (
              <input
                maxLength={50}
                placeholder="Enter a short note here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-1/2 p-2 text-black outline-none"
              />
            )}
            {error && (
              <div className="flex justify-center font-bold text-red-500">
                {error}
              </div>
            )}
            {instanceLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid w-full grid-cols-5 gap-5 pt-5">
                {instanceData?.instances.map((i) => (
                  <div
                    className={`flex flex-col items-center border-2 border-solid border-white p-2 text-black ${
                      i.rarity === `Common`
                        ? `bg-common-unfocus`
                        : i.rarity === `Rare`
                        ? `bg-rare-unfocus`
                        : i.rarity === `Epic`
                        ? `bg-epic-unfocus`
                        : `bg-legendary-unfocus`
                    }`}>
                    <div className="text-center text-xl font-bold capitalize">
                      {i.name}
                      {i.shiny && `⭐`}
                    </div>
                    <img src={i.img} />
                    {initiateModal && (
                      <button
                        onClick={() =>
                          initiateMutation.mutate(
                            {
                              instanceId: i.instanceId,
                              description: description
                            },
                            {
                              onSuccess(data, variables, context) {
                                setInitiateModal(false);
                                setError(null);
                                setDescription("");
                                utils.trade.getTrades.invalidate();
                              },
                              onError(error, variables, context) {
                                setError("This Pokémon is already in a trade");
                              }
                            }
                          )
                        }
                        disabled={initiateMutation.isLoading}
                        className="pointer-events-auto w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus">
                        Trade
                      </button>
                    )}
                    {offerModal && (
                      <button
                        onClick={() =>
                          offerMutation.mutate(
                            {
                              instanceId: i.instanceId,
                              tradeId: tradeId
                            },
                            {
                              onSuccess(data, variables, context) {
                                setOfferModal(false);
                                setError(null);
                                setDescription("");
                                utils.trade.getTrades.invalidate();
                              },
                              onError(error, variables, context) {
                                if (
                                  error.message ===
                                  "You can't give an offer for your own trade"
                                ) {
                                  setError(
                                    "You can't give an offer for your own trade"
                                  );
                                } else {
                                  setError(
                                    "This Pokémon is already in a trade"
                                  );
                                }
                              }
                            }
                          )
                        }
                        disabled={offerMutation.isLoading}
                        className="pointer-events-auto w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus">
                        Offer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}
      </div>
    </>
  );
}
