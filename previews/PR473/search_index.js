var documenterSearchIndex = {"docs":
[{"location":"examples/numa_aware/#NUMA-aware-SAXPY","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"","category":"section"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"This example demonstrates how to define and run a SAXPY kernel (single-precision Y[i] = a * X[i] + Y[i]) such that it runs efficiently on a system with multiple memory domains (NUMA) using multithreading. (You likely will need to fine-tune the value of N on your system of interest if you care about the particular measurement.)","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/numa_aware.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"Important remarks:","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"Pin your threads systematically to the available physical (or virtual) CPU-cores. ThreadPinning.jl is your friend.\nOpt-out of Julia's dynamic task scheduling (especially task migration) by using CPU(; static=true) instead of CPU().\nInitialize your data in parallel(!). It is of utmost importance to use a parallel access pattern for initialization that is as similar as possible as the access pattern of your computational kernel. The reason for this is \"NUMA first-touch policy\". KernelAbstractions.zeros(backend, dtype, N) is your friend.","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"Demonstration:","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"If above example is run with 128 Julia threads on a Noctua 2 compute node (128 physical cores distributed over two AMD Milan 7763 CPUs with 4 NUMA domains each), one may get the following numbers (comments for demonstration purposes):","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"Memory Bandwidth (GB/s): 145.64 # backend = CPU(), init = :parallel\nCompute (GFLOP/s): 24.27\n\nMemory Bandwidth (GB/s): 333.83 # backend = CPU(; static=true), init = :parallel\nCompute (GFLOP/s): 55.64\n\nMemory Bandwidth (GB/s): 32.74 # backend = CPU(), init = :serial\nCompute (GFLOP/s): 5.46\n\nMemory Bandwidth (GB/s): 32.46 # backend = CPU(; static=true), init = :serial\nCompute (GFLOP/s): 5.41","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"The key observations are the following:","category":"page"},{"location":"examples/numa_aware/","page":"NUMA-aware SAXPY","title":"NUMA-aware SAXPY","text":"Serial initialization leads to subpar performance (at least a factor of 4.5) independent of the chosen CPU backend. This is a manifestation of remark 3 above.\nThe static CPU backend gives >2x better performance than the one based on the dynamic Threads.@spawn. This is a manifestation of remark 2 (and, in some sense, also 1) above.","category":"page"},{"location":"examples/memcopy_static/#Memcopy-with-static-NDRange","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"","category":"section"},{"location":"examples/memcopy_static/","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"The first example simple copies memory from B to A. In contrast to the previous examples it uses a fully static kernel configuration. Specializing the kernel on the iteration range itself.","category":"page"},{"location":"examples/memcopy_static/","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/memcopy_static.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/memcopy/#Memcopy","page":"Memcopy","title":"Memcopy","text":"","category":"section"},{"location":"examples/memcopy/","page":"Memcopy","title":"Memcopy","text":"The first example simple copies memory from B to A","category":"page"},{"location":"examples/memcopy/","page":"Memcopy","title":"Memcopy","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/memcopy.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/atomix/#Atomic-operations-with-Atomix.jl","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"","category":"section"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"In case the different kernels access the same memory locations, race conditions can occur. KernelAbstractions uses  Atomix.jl to provide access to atomic memory operations.","category":"page"},{"location":"examples/atomix/#Race-conditions","page":"Atomic operations with Atomix.jl","title":"Race conditions","text":"","category":"section"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"The following example demonstrates a common race condition:","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"using CUDA, KernelAbstractions, Atomix\nusing ImageShow, ImageIO\n\n\nfunction index_fun(arr; backend=get_backend(arr))\n\tout = similar(arr)\n\tfill!(out, 0)\n\tkernel! = my_kernel!(backend)\n\tkernel!(out, arr, ndrange=(size(arr, 1), size(arr, 2)))\n\treturn out\nend\n\n@kernel function my_kernel!(out, arr)\n\ti, j = @index(Global, NTuple)\n\tfor k in 1:size(out, 1)\n\t\tout[k, i] += arr[i, j]\n\tend\nend\n\nimg = zeros(Float32, (50, 50));\nimg[10:20, 10:20] .= 1;\nimg[35:45, 35:45] .= 2;\n\n\nout = Array(index_fun(CuArray(img)));\nsimshow(out)","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"In principle, this kernel should just smears the values of the pixels along the first dimension. ","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"However, the different out[k, i] are accessed from multiple work-items and thus memory races can occur. We need to ensure that the accumulate += occurs atomically.","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"The resulting image has artifacts.","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"(Image: Resulting Image has artifacts)","category":"page"},{"location":"examples/atomix/#Fix-with-Atomix.jl","page":"Atomic operations with Atomix.jl","title":"Fix with Atomix.jl","text":"","category":"section"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"To fix this we need to mark the critical accesses with an Atomix.@atomic","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"function index_fun_fixed(arr; backend=get_backend(arr))\n\tout = similar(arr)\n\tfill!(out, 0)\n\tkernel! = my_kernel_fixed!(backend)\n\tkernel!(out, arr, ndrange=(size(arr, 1), size(arr, 2)))\n\treturn out\nend\n\n@kernel function my_kernel_fixed!(out, arr)\n\ti, j = @index(Global, NTuple)\n\tfor k in 1:size(out, 1)\n\t\tAtomix.@atomic out[k, i] += arr[i, j]\n\tend\nend\n\nout_fixed = Array(index_fun_fixed(CuArray(img)));\nsimshow(out_fixed)","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"This image is free of artifacts.","category":"page"},{"location":"examples/atomix/","page":"Atomic operations with Atomix.jl","title":"Atomic operations with Atomix.jl","text":"(Image: Resulting image is correct.)","category":"page"},{"location":"kernels/#Writing-kernels","page":"Writing kernels","title":"Writing kernels","text":"","category":"section"},{"location":"kernels/","page":"Writing kernels","title":"Writing kernels","text":"These kernel language constructs are intended to be used as part of @kernel functions and not valid outside that context.","category":"page"},{"location":"kernels/#Constant-arguments","page":"Writing kernels","title":"Constant arguments","text":"","category":"section"},{"location":"kernels/","page":"Writing kernels","title":"Writing kernels","text":"Kernel functions allow for input arguments to be marked with the @Const macro. It informs the compiler that the memory accessed through that marked input argument, will not be written to as part of the kernel. This has the implication that input arguments are not allowed to alias each other. If you are used to CUDA C this is similar to const restrict.","category":"page"},{"location":"kernels/#Indexing","page":"Writing kernels","title":"Indexing","text":"","category":"section"},{"location":"kernels/","page":"Writing kernels","title":"Writing kernels","text":"There are several @index variants.","category":"page"},{"location":"kernels/#Local-memory,-variable-lifetime-and-private-memory","page":"Writing kernels","title":"Local memory, variable lifetime and private memory","text":"","category":"section"},{"location":"kernels/","page":"Writing kernels","title":"Writing kernels","text":"@localmem, @synchronize, @private","category":"page"},{"location":"kernels/#Launching-kernels","page":"Writing kernels","title":"Launching kernels","text":"","category":"section"},{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/#api_kernel_language","page":"API","title":"Kernel language","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"@kernel\n@Const\n@index\n@localmem\n@private\n@synchronize\n@print\n@uniform\n@groupsize\n@ndrange\nsynchronize\nallocate","category":"page"},{"location":"api/#KernelAbstractions.@kernel","page":"API","title":"KernelAbstractions.@kernel","text":"@kernel function f(args) end\n\nTakes a function definition and generates a Kernel constructor from it. The enclosed function is allowed to contain kernel language constructs. In order to call it the kernel has first to be specialized on the backend and then invoked on the arguments.\n\nKernel language\n\n@Const\n@index\n@groupsize\n@ndrange\n@localmem\n@private\n@uniform\n@synchronize\n@print\n\nExample:\n\n@kernel function vecadd(A, @Const(B))\n    I = @index(Global)\n    @inbounds A[I] += B[I]\nend\n\nA = ones(1024)\nB = rand(1024)\nvecadd(CPU(), 64)(A, B, ndrange=size(A))\nsynchronize(backend)\n\n\n\n\n\n@kernel config function f(args) end\n\nThis allows for two different configurations:\n\ncpu={true, false}: Disables code-generation of the CPU function. This relaxes semantics such that KernelAbstractions primitives can be used in non-kernel functions.\ninbounds={false, true}: Enables a forced @inbounds macro around the function definition in the case the user is using too many @inbounds already in their kernel. Note that this can lead to incorrect results, crashes, etc and is fundamentally unsafe. Be careful!\n\n@context\n\nwarn: Warn\nThis is an experimental feature.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@Const","page":"API","title":"KernelAbstractions.@Const","text":"@Const(A)\n\n@Const is an argument annotiation that asserts that the memory reference by A is both not written to as part of the kernel and that it does not alias any other memory in the kernel.\n\ndanger: Danger\nViolating those constraints will lead to arbitrary behaviour.As an example given a kernel signature kernel(A, @Const(B)), you are not allowed to call the kernel with kernel(A, A) or kernel(A, view(A, :)).\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@index","page":"API","title":"KernelAbstractions.@index","text":"@index\n\nThe @index macro can be used to give you the index of a workitem within a kernel function. It supports both the production of a linear index or a cartesian index. A cartesian index is a general N-dimensional index that is derived from the iteration space.\n\nIndex granularity\n\nGlobal: Used to access global memory.\nGroup: The index of the workgroup.\nLocal: The within workgroup index.\n\nIndex kind\n\nLinear: Produces an Int64 that can be used to linearly index into memory.\nCartesian: Produces a CartesianIndex{N} that can be used to index into memory.\nNTuple: Produces a NTuple{N} that can be used to index into memory.\n\nIf the index kind is not provided it defaults to Linear, this is subject to change.\n\nExamples\n\n@index(Global, Linear)\n@index(Global, Cartesian)\n@index(Local, Cartesian)\n@index(Group, Linear)\n@index(Local, NTuple)\n@index(Global)\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@localmem","page":"API","title":"KernelAbstractions.@localmem","text":"@localmem T dims\n\nDeclare storage that is local to a workgroup.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@private","page":"API","title":"KernelAbstractions.@private","text":"@private T dims\n\nDeclare storage that is local to each item in the workgroup. This can be safely used across @synchronize statements. On a CPU, this will allocate additional implicit dimensions to ensure correct localization.\n\nFor storage that only persists between @synchronize statements, an MArray can be used instead.\n\nSee also @uniform.\n\n\n\n\n\n@private mem = 1\n\nCreates a private local of mem per item in the workgroup. This can be safely used across @synchronize statements.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@synchronize","page":"API","title":"KernelAbstractions.@synchronize","text":"@synchronize()\n\nAfter a @synchronize statement all read and writes to global and local memory from each thread in the workgroup are visible in from all other threads in the workgroup.\n\n\n\n\n\n@synchronize(cond)\n\nAfter a @synchronize statement all read and writes to global and local memory from each thread in the workgroup are visible in from all other threads in the workgroup. cond is not allowed to have any visible sideffects.\n\nPlatform differences\n\nGPU: This synchronization will only occur if the cond evaluates.\nCPU: This synchronization will always occur.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@print","page":"API","title":"KernelAbstractions.@print","text":"@print(items...)\n\nThis is a unified print statement.\n\nPlatform differences\n\nGPU: This will reorganize the items to print via @cuprintf\nCPU: This will call print(items...)\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@uniform","page":"API","title":"KernelAbstractions.@uniform","text":"@uniform expr\n\nexpr is evaluated outside the workitem scope. This is useful for variable declarations that span workitems, or are reused across @synchronize statements.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@groupsize","page":"API","title":"KernelAbstractions.@groupsize","text":"@groupsize()\n\nQuery the workgroupsize on the backend. This function returns a tuple corresponding to kernel configuration. In order to get the total size you can use prod(@groupsize()).\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@ndrange","page":"API","title":"KernelAbstractions.@ndrange","text":"@ndrange()\n\nQuery the ndrange on the backend. This function returns a tuple corresponding to kernel configuration.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.synchronize","page":"API","title":"KernelAbstractions.synchronize","text":"synchronize(::Backend)\n\nSynchronize the current backend.\n\nnote: Note\nBackend implementations must implement this function.\n\n\n\n\n\n","category":"function"},{"location":"api/#KernelAbstractions.allocate","page":"API","title":"KernelAbstractions.allocate","text":"allocate(::Backend, Type, dims...)::AbstractArray\n\nAllocate a storage array appropriate for the computational backend.\n\nnote: Note\nBackend implementations must implement allocate(::NewBackend, T, dims::Tuple)\n\n\n\n\n\n","category":"function"},{"location":"api/#Host-language","page":"API","title":"Host language","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"KernelAbstractions.zeros","category":"page"},{"location":"api/#KernelAbstractions.zeros","page":"API","title":"KernelAbstractions.zeros","text":"zeros(::Backend, Type, dims...)::AbstractArray\n\nAllocate a storage array appropriate for the computational backend filled with zeros.\n\n\n\n\n\n","category":"function"},{"location":"api/#Internal","page":"API","title":"Internal","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"KernelAbstractions.Kernel\nKernelAbstractions.partition\nKernelAbstractions.@context","category":"page"},{"location":"api/#KernelAbstractions.Kernel","page":"API","title":"KernelAbstractions.Kernel","text":"Kernel{Backend, WorkgroupSize, NDRange, Func}\n\nKernel closure struct that is used to represent the backend kernel on the host. WorkgroupSize is the number of workitems in a workgroup.\n\nnote: Note\nBackend implementations must implement:(kernel::Kernel{<:NewBackend})(args...; ndrange=nothing, workgroupsize=nothing)As well as the on-device functionality.\n\n\n\n\n\n","category":"type"},{"location":"api/#KernelAbstractions.partition","page":"API","title":"KernelAbstractions.partition","text":"Partition a kernel for the given ndrange and workgroupsize.\n\n\n\n\n\n","category":"function"},{"location":"api/#KernelAbstractions.@context","page":"API","title":"KernelAbstractions.@context","text":"@context()\n\nAccess the hidden context object used by KernelAbstractions.\n\nwarn: Warn\nOnly valid to be used from a kernel with cpu=false.\n\nfunction f(@context, a)\n    I = @index(Global, Linear)\n    a[I]\nend\n\n@kernel cpu=false function my_kernel(a)\n    f(@context, a)\nend\n\n\n\n\n\n","category":"macro"},{"location":"extras/unrolling/#Unroll-macro","page":"Unroll macro","title":"Unroll macro","text":"","category":"section"},{"location":"extras/unrolling/","page":"Unroll macro","title":"Unroll macro","text":"CurrentModule = KernelAbstractions.Extras","category":"page"},{"location":"extras/unrolling/","page":"Unroll macro","title":"Unroll macro","text":"@unroll","category":"page"},{"location":"extras/unrolling/#KernelAbstractions.Extras.LoopInfo.@unroll","page":"Unroll macro","title":"KernelAbstractions.Extras.LoopInfo.@unroll","text":"@unroll expr\n\nTakes a for loop as expr and informs the LLVM unroller to fully unroll it, if it is safe to do so and the loop count is known.\n\n\n\n\n\n@unroll N expr\n\nTakes a for loop as expr and informs the LLVM unroller to unroll it N times, if it is safe to do so.\n\n\n\n\n\n","category":"macro"},{"location":"design/#Design-notes","page":"Design notes","title":"Design notes","text":"","category":"section"},{"location":"design/","page":"Design notes","title":"Design notes","text":"Loops are affine\nOperation over workgroups/blocks\nGoal: Kernel fusion\n@Const:\nrestrict const in C\nldg on the GPU\n@aliasscopes on the CPU\nCartesian or Linear indicies supported\n`@index(Linear)\n`@index(Cartesian)\n@synchronize for inserting workgroup-level synchronization\nworkgroupsize constant\nmay allow for Dynamic()\nterminology – how much to borrow from OpenCL\nhttp://portablecl.org/docs/html/kernel_compiler.html#work-group-function-generation","category":"page"},{"location":"design/#TODO","page":"Design notes","title":"TODO","text":"","category":"section"},{"location":"design/","page":"Design notes","title":"Design notes","text":"Do we want to support Cartesian indices?\nJust got removed from GPUArrays\nrecovery is costly\nGoing from Cartesian to linear sometimes confuses LLVM (IIRC this is true for dynamic strides, due to overflow issues)\n@index(Global, Linear)\nSupport non-multiple of workgroupsize\ndo we require index inbounds checks?\nHarmful for CPU vectorization – likely want to generate two kernels\nMultithreading requires 1.3\nTests\nDocs\nExamples\nIndex calculations\ninbounds checks on the GPU\n","category":"page"},{"location":"examples/naive_transpose/#Naive-Transpose","page":"Naive Transpose","title":"Naive Transpose","text":"","category":"section"},{"location":"examples/naive_transpose/","page":"Naive Transpose","title":"Naive Transpose","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/naive_transpose.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"implementations/#Notes-for-backend-implementations","page":"Notes for implementations","title":"Notes for backend implementations","text":"","category":"section"},{"location":"implementations/#Semantics-of-KernelAbstractions.synchronize","page":"Notes for implementations","title":"Semantics of KernelAbstractions.synchronize","text":"","category":"section"},{"location":"implementations/","page":"Notes for implementations","title":"Notes for implementations","text":"KernelAbstractions.synchronize is required to be cooperative, with that we mean it can not block inside an external library, but instead must implement a cooperative wait that will yield the current task and return the scheduling slice to the Julia runtime.","category":"page"},{"location":"implementations/","page":"Notes for implementations","title":"Notes for implementations","text":"This is of particular import to allow for overlapping of communication and computation with MPI.","category":"page"},{"location":"quickstart/#Quickstart","page":"Quickstart","title":"Quickstart","text":"","category":"section"},{"location":"quickstart/#Terminology","page":"Quickstart","title":"Terminology","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Because CUDA is the most popular GPU programming environment, we can use it as a reference for defining terminology in KA. A workgroup is called a block in NVIDIA CUDA and designates a group of threads acting in parallel, preferably in lockstep. For the GPU, the workgroup size is typically around 256, while for the CPU, it is usually a multiple of the natural vector-width. An ndrange is called a grid in NVIDIA CUDA and designates the total number of work items. If using a workgroup of size 1 (non-parallel execution), the ndrange is the number of items to iterate over in a loop.","category":"page"},{"location":"quickstart/#Writing-your-first-kernel","page":"Quickstart","title":"Writing your first kernel","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"Kernel functions are marked with the @kernel. Inside the @kernel macro you can use the kernel language. As an example, the mul2 kernel below will multiply each element of the array A by 2. It uses the @index macro to obtain the global linear index of the current work item.","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"@kernel function mul2_kernel(A)\n  I = @index(Global)\n  A[I] = 2 * A[I]\nend","category":"page"},{"location":"quickstart/#Launching-kernel-on-the-host","page":"Quickstart","title":"Launching kernel on the host","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"You can construct a kernel for a specific backend by calling the kernel with mul2_kernel(CPU(), 16). The first argument is a backend of type KA.Backend, the second argument being the workgroup size. This returns a generated kernel executable that is then executed with the input argument A and the additional argument being a static ndrange.","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"dev = CPU()\nA = ones(1024, 1024)\nev = mul2_kernel(dev, 64)(A, ndrange=size(A))\nsynchronize(dev)\nall(A .== 2.0)","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"All kernels are launched asynchronously. The synchronize blocks the host until the kernel has completed on the backend.","category":"page"},{"location":"quickstart/#Launching-kernel-on-the-backend","page":"Quickstart","title":"Launching kernel on the backend","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"To launch the kernel on a backend-supported backend isa(backend, KA.GPU) (e.g., CUDABackend(), ROCBackend(), oneBackend()), we generate the kernel for this backend.","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"First, we initialize the array using the Array constructor of the chosen backend with","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"using CUDA: CuArray\nA = CuArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"using AMDGPU: ROCArray\nA = ROCArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"using oneAPI: oneArray\nA = oneArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"The kernel generation and execution are then","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"backend = get_backend(A)\nmul2_kernel(backend, 64)(A, ndrange=size(A))\nsynchronize(backend)\nall(A .== 2.0)","category":"page"},{"location":"quickstart/#Synchronization","page":"Quickstart","title":"Synchronization","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"danger: Danger\nAll kernel launches are asynchronous, use synchronize(backend) to wait on a series of kernel launches.","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"The code around KA may heavily rely on GPUArrays, for example, to intialize variables.","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"function mymul(A)\n    A .= 1.0\n    backend = get_backend(A)\n    ev = mul2_kernel(backend, 64)(A, ndrange=size(A))\n    synchronize(backend)\n    all(A .== 2.0)\nend","category":"page"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"function mymul(A, B)\n    A .= 1.0\n    B .= 3.0\n    backend = get_backend(A)\n    @assert get_backend(B) == backend\n    mul2_kernel(backend, 64)(A, ndrange=size(A))\n    mul2_kernel(backend, 64)(B, ndrange=size(B))\n    synchronize(backend)\n    all(A .+ B .== 8.0)\nend","category":"page"},{"location":"quickstart/#Using-task-programming-to-launch-kernels-in-parallel.","page":"Quickstart","title":"Using task programming to launch kernels in parallel.","text":"","category":"section"},{"location":"quickstart/","page":"Quickstart","title":"Quickstart","text":"TODO","category":"page"},{"location":"#KernelAbstractions","page":"Home","title":"KernelAbstractions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"KernelAbstractions.jl (KA) is a package that allows you to write GPU-like kernels targetting different execution backends. KA intends to be a minimal and performant library that explores ways to write heterogeneous code. Although parts of the package are still experimental, it has been used successfully as part of the Exascale Computing Project to run Julia code on pre-Frontier and pre-Aurora systems. Currently, profiling and debugging require backend-specific calls like, for example, in CUDA.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"note: Note\nWhile KernelAbstraction.jl is focused on performance portability, it emulates GPU semantics and therefore the kernel language has several constructs that are necessary for good performance on the GPU, but serve no purpose on the CPU. In these cases, we either ignore such statements entirely (such as with @synchronize) or swap out the construct for something similar on the CPU (such as using an MVector  to replace @localmem). This means that CPU performance will still be fast, but might be performing extra work to provide a consistent programming model across GPU and CPU","category":"page"},{"location":"#Supported-backends","page":"Home","title":"Supported backends","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"All supported backends rely on their respective Julia interface to the compiler backend and depend on GPUArrays.jl and GPUCompiler.jl.","category":"page"},{"location":"#CUDA","page":"Home","title":"CUDA","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"import CUDA\nusing KernelAbstractions","category":"page"},{"location":"","page":"Home","title":"Home","text":"CUDA.jl is currently the most mature way to program for GPUs. This provides a backend CUDABackend <: KA.Backend to CUDA.","category":"page"},{"location":"#Changelog","page":"Home","title":"Changelog","text":"","category":"section"},{"location":"#0.9","page":"Home","title":"0.9","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Major refactor of KernelAbstractions. In particular:","category":"page"},{"location":"","page":"Home","title":"Home","text":"Removal of the event system. Kernel are now implicitly ordered.\nRemoval of backend packages, backends are now directly provided by CUDA.jl and similar","category":"page"},{"location":"#Semantic-differences","page":"Home","title":"Semantic differences","text":"","category":"section"},{"location":"#To-CUDA.jl/AMDGPU.jl","page":"Home","title":"To CUDA.jl/AMDGPU.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The kernels are automatically bounds-checked against either the dynamic or statically provided ndrange.\nKernels implictly return nothing","category":"page"},{"location":"#Contributing","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Please file any bug reports through Github issues or fixes through a pull request. Any heterogeneous hardware or code aficionados is welcome to join us on our journey.","category":"page"},{"location":"examples/performance/#Measuring-performance","page":"Measuring performance","title":"Measuring performance","text":"","category":"section"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"Run under nsight-cu:","category":"page"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"nv-nsight-cu-cli --nvtx --profile-from-start=off --section=SpeedOfLight --section=julia --project=examples examples/performance.jl","category":"page"},{"location":"examples/performance/#Results:","page":"Measuring performance","title":"Results:","text":"","category":"section"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"Collated results on a V100:","category":"page"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"Kernel Time Speed of Light Mem %\nnaive (32, 32) 1.19ms 65.06%\nnaive (1024, 1) 1.79ms 56.13 %\nnaive (1, 1024) 3.03ms 60.02 %","category":"page"},{"location":"examples/performance/#Full-output:","page":"Measuring performance","title":"Full output:","text":"","category":"section"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"==PROF==   0: Naive transpose (32, 32)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         878.88\n    SOL FB                                                                               %                          38.16\n    Elapsed Cycles                                                                   cycle                      1,447,874\n    SM Frequency                                                             cycle/nsecond                           1.23\n    Memory [%]                                                                           %                          65.93\n    Duration                                                                       msecond                           1.17\n    SOL L2                                                                               %                          19.08\n    SOL TEX                                                                              %                          66.19\n    SM Active Cycles                                                                 cycle                   1,440,706.40\n    SM [%]                                                                               %                          23.56\n    ---------------------------------------------------------------------- --------------- ------------------------------\n\n  ptxcall___gpu_transpose_kernel_naive__430_2, 2020-Feb-20 22:42:24, Context 1, Stream 23\n\n==PROF==   0: Naive transpose (1024, 1)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         877.69\n    SOL FB                                                                               %                          22.40\n    Elapsed Cycles                                                                   cycle                      2,473,141\n    SM Frequency                                                             cycle/nsecond                           1.23\n    Memory [%]                                                                           %                          51.17\n    Duration                                                                       msecond                           2.00\n    SOL L2                                                                               %                          50.17\n    SOL TEX                                                                              %                          51.27\n    SM Active Cycles                                                                 cycle                   2,465,610.06\n    SM [%]                                                                               %                          11.68\n    ---------------------------------------------------------------------- --------------- ------------------------------\n\n  ptxcall___gpu_transpose_kernel_naive__430_3, 2020-Feb-20 22:42:28, Context 1, Stream 25\n\n==PROF==   0: Naive transpose (1, 1024)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         876.69\n    SOL FB                                                                               %                          17.88\n    Elapsed Cycles                                                                   cycle                      3,737,127\n    SM Frequency                                                             cycle/nsecond                           1.24\n    Memory [%]                                                                           %                          60.02\n    Duration                                                                       msecond                           3.02\n    SOL L2                                                                               %                          60.02\n    SOL TEX                                                                              %                          45.65\n    SM Active Cycles                                                                 cycle                   3,732,591.59\n    SM [%]                                                                               %                          12.56\n    ---------------------------------------------------------------------- --------------- ------------------------------","category":"page"},{"location":"examples/performance/#Code","page":"Measuring performance","title":"Code","text":"","category":"section"},{"location":"examples/performance/","page":"Measuring performance","title":"Measuring performance","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/performance.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/matmul/#Matmul","page":"Matmul","title":"Matmul","text":"","category":"section"},{"location":"examples/matmul/","page":"Matmul","title":"Matmul","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/matmul.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"}]
}
