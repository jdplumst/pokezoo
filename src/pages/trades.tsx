import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "../app/_components/LoadingSpinner";
import Modal from "../components/Modal";
import { ThemeContext } from "../components/ThemeContextProvider";
import ThemeWrapper from "../components/ThemeWrapper";

export default function Trades() {
  const { data: session, status } = useSession({
    required: true,
  });

  const utils = trpc.useUtils();

  const { time } = useContext(ThemeContext);

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

  const [error, setError] = useState<null | string>(null);

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>PokéZoo - Trades</title>
        <meta
          name="description"
          content="PokéZoo"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>

      {/* Main Trading Screen */}
      <ThemeWrapper>
        <Sidebar page="Trades">
          <Topbar />
          <main className="p-4">
            <button
              onClick={() => setInitiateModal(true)}
              disabled={initiateModal}
              className={`w-48 rounded-lg border-2 border-black p-2 font-bold ${
                time === `day`
                  ? `bg-yellow-btn-unfocus hover:bg-yellow-btn-focus`
                  : `bg-purple-btn-unfocus hover:bg-purple-btn-focus`
              }`}
            >
              Add Trade
            </button>
            {tradeLoading ? (
              <div className="flex items-center justify-center pt-5">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="trades grid justify-center gap-10 pt-5">
                {tradeData?.trades.map((t) => (
                  <div
                    key={t.trade.id}
                    className="h-76 w-[600px] border-2 border-solid border-black bg-rose-600 p-2"
                  >
                    <div className="flex h-full w-full justify-between">
                      <div className="flex w-1/2 flex-col items-center justify-between gap-5">
                        <div className="h-8 text-center text-xl font-bold">
                          {t.initiator.username} wants to trade!
                        </div>
                        <div
                          className={`h-48 border-2 border-solid border-black p-2 ${
                            t.initiatorRarity.name === `Common`
                              ? `bg-common-unfocus`
                              : t.initiatorRarity.name === `Rare`
                                ? `bg-rare-unfocus`
                                : t.initiatorRarity.name === `Epic`
                                  ? `bg-epic-unfocus`
                                  : `bg-legendary-unfocus`
                          }`}
                        >
                          <img
                            src={t.initiatorSpecies.img}
                            alt={t.initiatorSpecies.name}
                            width={150}
                            height={150}
                          ></img>
                          <div className="text-center font-bold capitalize">
                            {t.initiatorSpecies.name}
                            {t.initiatorSpecies.shiny && `⭐`}
                          </div>
                        </div>
                        <div className="h-8 text-xl">{t.trade.description}</div>
                        {t.trade.initiatorId === session.user.id ? (
                          <button
                            onClick={() =>
                              cancelMutation.mutate(
                                { tradeId: t.trade.id },
                                {
                                  onSuccess() {
                                    void utils.trade.getTrades.invalidate();
                                  },
                                },
                              )
                            }
                            disabled={cancelMutation.isLoading}
                            className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                          >
                            Cancel
                          </button>
                        ) : (
                          <div className="h-11"></div>
                        )}
                      </div>
                      <div className="h-full w-[1px] border-2 border-solid border-black"></div>
                      {t.offerer &&
                      t.offererInstance &&
                      t.offererSpecies &&
                      t.offererRarity ? (
                        <div className="flex w-1/2 flex-col items-center justify-between gap-5">
                          <div className="h-8 text-center text-xl font-bold">
                            {t.offerer.username} has an offer!
                          </div>
                          <div
                            className={`h-48 border-2 border-solid border-black p-2 ${
                              t.offererRarity.name === `Common`
                                ? `bg-common-unfocus`
                                : t.offererRarity.name === `Rare`
                                  ? `bg-rare-unfocus`
                                  : t.offererRarity.name === `Epic`
                                    ? `bg-epic-unfocus`
                                    : `bg-legendary-unfocus`
                            }`}
                          >
                            <img
                              src={t.offererSpecies.img}
                              alt={t.offererSpecies.name}
                              width={150}
                              height={150}
                            ></img>
                            <div className="text-center font-bold capitalize">
                              {t.offererSpecies.name}
                              {t.offererSpecies.shiny && `⭐`}
                            </div>
                          </div>
                          <div className="h-8"></div>
                          {t.trade.offererId === session.user.id ? (
                            <button
                              onClick={() =>
                                withdrawMutation.mutate(
                                  { tradeId: t.trade.id },
                                  {
                                    onSuccess() {
                                      void utils.trade.getTrades.invalidate();
                                    },
                                  },
                                )
                              }
                              disabled={withdrawMutation.isLoading}
                              className="w-24 rounded-lg border-2 border-black bg-blue-btn-unfocus p-2 font-bold hover:bg-blue-btn-focus"
                            >
                              Withdraw
                            </button>
                          ) : t.trade.offererId &&
                            t.trade.initiatorId === session.user.id ? (
                            <div className="flex gap-5">
                              <button
                                onClick={() =>
                                  acceptMutation.mutate(
                                    { tradeId: t.trade.id },
                                    {
                                      onSuccess() {
                                        void utils.trade.getTrades.invalidate();
                                        void utils.profile.getProfile.invalidate();
                                      },
                                    },
                                  )
                                }
                                disabled={acceptMutation.isLoading}
                                className="w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  rejectMutation.mutate(
                                    { tradeId: t.trade.id },
                                    {
                                      onSuccess() {
                                        void utils.trade.getTrades.invalidate();
                                      },
                                    },
                                  )
                                }
                                disabled={rejectMutation.isLoading}
                                className="w-24 rounded-lg border-2 border-black bg-red-btn-unfocus p-2 font-bold hover:bg-red-btn-focus"
                              >
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
                              setTradeId(t.trade.id);
                            }}
                            disabled={offerModal}
                            className="w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus"
                          >
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
              className="absolute right-4 top-4 text-3xl font-bold"
            >
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
                    key={i.instanceId}
                    className={`flex flex-col items-center border-2 border-solid border-white p-2 text-black ${
                      i.rarity === `Common`
                        ? `bg-common-unfocus`
                        : i.rarity === `Rare`
                          ? `bg-rare-unfocus`
                          : i.rarity === `Epic`
                            ? `bg-epic-unfocus`
                            : `bg-legendary-unfocus`
                    }`}
                  >
                    <div className="text-center text-xl font-bold capitalize">
                      {i.name}
                      {i.shiny && `⭐`}
                    </div>
                    <img
                      src={i.img}
                      alt={i.name}
                    />
                    {initiateModal && (
                      <button
                        onClick={() =>
                          initiateMutation.mutate(
                            {
                              instanceId: i.instanceId,
                              description: description,
                            },
                            {
                              onSuccess() {
                                setInitiateModal(false);
                                setError(null);
                                setDescription("");
                                void utils.trade.getTrades.invalidate();
                              },
                              onError() {
                                setError("This Pokémon is already in a trade");
                              },
                            },
                          )
                        }
                        disabled={initiateMutation.isLoading}
                        className="pointer-events-auto w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus"
                      >
                        Trade
                      </button>
                    )}
                    {offerModal && (
                      <button
                        onClick={() =>
                          offerMutation.mutate(
                            {
                              instanceId: i.instanceId,
                              tradeId: tradeId,
                            },
                            {
                              onSuccess() {
                                setOfferModal(false);
                                setError(null);
                                setDescription("");
                                void utils.trade.getTrades.invalidate();
                              },
                              onError(error) {
                                if (
                                  error.message ===
                                  "You can't give an offer for your own trade"
                                ) {
                                  setError(
                                    "You can't give an offer for your own trade",
                                  );
                                } else {
                                  setError(
                                    "This Pokémon is already in a trade",
                                  );
                                }
                              },
                            },
                          )
                        }
                        disabled={offerMutation.isLoading}
                        className="pointer-events-auto w-24 rounded-lg border-2 border-black bg-green-btn-unfocus p-2 font-bold hover:bg-green-btn-focus"
                      >
                        Offer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}
      </ThemeWrapper>
    </>
  );
}
