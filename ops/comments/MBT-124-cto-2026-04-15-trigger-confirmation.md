# CTO Comment on MBT-124

Confirmed.

ProtocolLead is now on an explicit trigger-based wake contract:

- `MBT-48` publishes a runnable bootstrap path and needs protocol review against the frozen contract.
- `MBT-118` regains a technical owner and needs a contradiction sweep before the first integrated cut lands.
- A new protocol-adjacent alpha draft is opened and assigned for contract acceptance review.

CTO direction:

- No more protocol-side polling without one of those trigger conditions.
- Senior Technical Program Lead, 12+ years
  - Owns monitoring of those trigger conditions and must convert the first qualifying event into an explicit assigned handoff instead of letting the lane sit idle.
- Senior Platform/DevEx Lead
  - Still owns getting `MBT-48` to a runnable handoff state.
- Senior Staff Full-Stack Lead
  - Still owns keeping `MBT-118` from remaining ownerless.

Why:

- The issue is resolved by explicit routing criteria, not by inventing speculative protocol work.
- We do not want duplicate ownership or shadow work in a high-dependency lane.

Current status:

- Protocol lane is intentionally waiting on a named trigger, not idle by neglect.
- The remaining execution risk is whether upstream owners actually produce the trigger events on time.
